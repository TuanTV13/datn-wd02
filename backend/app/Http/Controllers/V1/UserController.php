<?php

namespace App\Http\Controllers\V1;

use App\Helpers\EmailHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    const PATH_UPLOAD = 'images/users';

    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index()
    {
        // Lấy toàn bộ danh sách người dùng từ repository
        $users = $this->userRepository->all();

        // Trả về danh sách người dùng dưới dạng JSON kèm mã HTTP 200
        return response()->json([
            'Danh sách người dùng', // Đây là phần không hợp lý, có thể thay bằng key "message" để chuẩn hóa.
            'users' => $users // Trả về danh sách người dùng
        ], 200);
    }


    public function show($id)
    {
        // Tìm người dùng theo ID từ repository
        $user = $this->userRepository->find($id);

        // Trả về thông tin người dùng dưới dạng JSON
        return response()->json([
            'data' => $user // Dữ liệu người dùng
        ]);
    }


    public function create(StoreUserRequest $request)
    {
        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        DB::beginTransaction();
        try {
            // Lấy dữ liệu đã được xác thực từ request
            $data = $request->validated();

            // Chuẩn hóa email: chuyển thành chữ thường và loại bỏ khoảng trắng không cần thiết
            $data['email'] = EmailHelper::trimEmail(EmailHelper::toLowerCase($data['email']));

            // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
            $data['password'] = Hash::make($data['password']);

            // Kiểm tra nếu có file hình ảnh được upload, lưu hình ảnh vào thư mục định sẵn và lưu đường dẫn
            if ($request->hasFile('image')) {
                $data['image'] = Storage::put(self::PATH_UPLOAD, $request->file('image'));
            }

            // Đặt thời gian xác minh email (giả định email đã được xác minh)
            $data['email_verified_at'] = now();

            // Thêm mới người dùng vào cơ sở dữ liệu
            $user = $this->userRepository->create($data);

            // Gán vai trò "user" cho người dùng vừa tạo
            $user->assignRole('user');

            // Xác nhận transaction thành công
            DB::commit();

            // Trả về phản hồi JSON với mã HTTP 201 (Created)
            return response()->json(['message' => 'Tạo mới người dùng thành công!'], 201);
        } catch (\Exception $e) {
            // Nếu xảy ra lỗi, rollback tất cả các thay đổi trong transaction
            DB::rollBack();

            // Trả về phản hồi JSON với mã HTTP 500 (Internal Server Error)
            return response()->json(['error' => 'Đã xảy ra lỗi khi thêm mới người dùng!'], 500);
        }
    }


    public function destroy(string $id)
    {
        try {
            // Tìm người dùng theo ID
            $user = $this->userRepository->find($id);
            if (!$user) {
                // Nếu không tìm thấy người dùng, trả về thông báo lỗi kèm mã HTTP 404
                return response()->json(['error' => 'Người dùng không tồn tại!'], 404);
            }

            // Xóa người dùng
            $user->delete();

            // Trả về phản hồi thành công kèm mã HTTP 200
            return response()->json(['message' => 'Xóa người dùng thành công!'], 200);
        } catch (\Exception $e) {
            // Nếu có lỗi xảy ra, trả về phản hồi lỗi kèm mã HTTP 500
            return response()->json(['error' => 'Đã xảy ra lỗi khi xóa người dùng!'], 500);
        }
    }

    public function trashed()
    {
        $data = $this->userRepository->trashed();

        // Nếu có người dùng đã xóa, trả về danh sách cùng thông báo kèm mã HTTP 200
        return response()->json([
            'message' => 'Danh sách người dùng đã xóa.',
            'data' => $data
        ], 200);
    }

    public function restore($id)
    {
        // Tìm người dùng đã bị xóa tạm thời theo ID
        $user = $this->userRepository->findTrashed($id);

        // Kiểm tra nếu người dùng không tồn tại
        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng đã xóa.'
            ], 404);
        }

        $user->restore();

        // Trả về thông báo thành công kèm mã HTTP 200
        return response()->json([
            'message' => 'Khôi phục người dùng thành công.'
        ], 200);
    }
}
