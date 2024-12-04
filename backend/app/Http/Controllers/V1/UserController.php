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
        $users = $this->userRepository->all();
        return response()->json([
            'Danh sách người dùng',
            'users' => $users
        ], 200);
    }

    public function show($id)
    {
        $user = $this->userRepository->find($id);
        return response()->json([
            'data' => $user
        ]);
    }

    public function create(StoreUserRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $data['email'] = EmailHelper::trimEmail(EmailHelper::toLowerCase($data['email']));
            $data['password'] = Hash::make($data['password']);

            if ($request->hasFile('image')) {
                $data['image'] = Storage::put(self::PATH_UPLOAD, $request->file('image'));
            }

            $data['email_verified_at'] = now();
            $user = $this->userRepository->create($data);

            $user->assignRole('user');

            DB::commit();

            return response()->json(['message' => 'Tạo người dùng thành công!'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Đã xảy ra lỗi khi thêm người dùng!'], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $user = $this->userRepository->find($id);
            if (!$user) {
                return response()->json(['error' => 'Người dùng không tồn tại!'], 404);
            }

            $user->delete();

            return response()->json(['message' => 'Xóa người dùng thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi khi xóa người dùng!'], 500);
        }
    }

    public function trashed()
    {
        $data = $this->userRepository->trashed();

        return response()->json([
            'message' => 'Danh sách người dùng đã xóa.',
            'data' => $data
        ], 200);
    }

    public function restore($id)
    {
        $user = $this->userRepository->findTrashed($id);

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng đã xóa.'
            ], 404);
        }

        $user->restore();

        return response()->json([
            'message' => 'Khôi phục người dùng thành công.'
        ], 200);
    }
}
