<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Repositories\Admin\UserRepository;
use App\Models\User;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserService
{
    protected $userRepository;
    protected $api_key;
    protected $client;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
        $this->client = new Client();
        $this->api_key = env('KICKBOX_API_KEY');
    }

    public function findById($id)
    {
        return $this->userRepository->find($id);
    }


    public function create(RegisterRequest $registerRequest)
    {
        $data = $registerRequest->validated();

        // Nếu bạn muốn kiểm tra email thì có thể để lại đoạn mã này
        if (!$this->verifyEmail($data['email'])) {
            Log::info("Email không hợp lệ: " . $data['email']);
            throw ValidationException::withMessages([
                'email' => 'Email không hợp lệ hoặc không tồn tại. Vui lòng thử lại với một địa chỉ email khác.',
            ]);
        }

        try {
            // Xử lý ảnh người dùng nếu có
            if ($registerRequest->hasFile('image')) {
                $data['image'] = Storage::put('users', $registerRequest->file('image'));
            }

            // Mã hóa mật khẩu
            $data['password'] = bcrypt($data['password']);

            $data['email_verified_at'] = now();

            // Tạo người dùng
            $user = User::create($data);

            // Ghi log thông tin người dùng đã được tạo
            Log::info("Người dùng đã được tạo: ", $data);

            return ['message' => 'Đăng ký thành công'];
        } catch (\Throwable $th) {
            Log::error("Lỗi hệ thống khi tạo người dùng: " . $th->getMessage());
            return ['message' => 'Lỗi hệ thống'];
        }
    }

    // Phương thức kiểm tra email qua API Kickbox (có thể bỏ nếu không cần)
    public function verifyEmail($email)
    {
        try {
            $response = $this->client->request('GET', 'https://api.kickbox.com/v2/verify', [
                'query' => [
                    'email' => $email,
                    'apikey' => $this->api_key
                ]
            ]);

            if ($response->getStatusCode() !== 200) {
                Log::error("Kickbox API trả về lỗi: {$response->getStatusCode()}");
                return false;
            }

            $result = json_decode($response->getBody(), true);

            // Kiểm tra kết quả từ API
            if (isset($result['result']) && $result['result'] === 'deliverable') {
                return true;
            }

            Log::warning("Kickbox không xác nhận được email: " . $email);
            return false;
        } catch (Exception $e) {
            Log::error("Lỗi khi gọi API Kickbox: " . $e->getMessage());
            return false;
        }
    }

    public function update(UpdateUserRequest $updateUserRequest, $id)
    {

        try {
            $userData = $updateUserRequest->validated();

            $this->userRepository->update($userData, $id);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'user' => $userData
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Cập nhật người dùng thất bại: ' . $th->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return [
                'status' => false,
                'message' => 'Không tồn tại người dùng: ' . $id
            ];
        }

        try {
            $user->refreshTokens()->delete();

            $this->userRepository->delete($id);

            return [
                'status' => true,
                'message' => 'Xóa thành công'
            ];
        } catch (\Throwable $th) {
            Log::error('Xóa người dùng thất bại: ' . $th->getMessage());

            return [
                'status' => false,
                'message' => 'Lỗi hệ thống'
            ];
        }
    }

    public function show($id)
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return ['status' => false, 'message' => 'Không tồn tại người dùng'];
        }

        try {
            return ['status' => true, 'user' => $user];
        } catch (\Throwable $th) {
            Log::error('Xóa người dùng thất bại: ' . $th->getMessage());

            return [
                'status' => false,
                'message' => 'Lỗi hệ thống'
            ];
        }
    }
}
