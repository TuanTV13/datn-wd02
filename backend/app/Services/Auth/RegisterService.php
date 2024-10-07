<?php

namespace App\Services\Auth;

use App\Events\UserRegisterdSuccess;
use App\Helpers\EmailHelper;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Repositories\Auth\RegisterRepository;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class RegisterService
{
    protected $registerRepository;
    protected $api_key;
    protected $client;

    public function __construct(RegisterRepository $registerRepository)
    {
        $this->registerRepository = $registerRepository;
        $this->client = new Client();
        $this->api_key = env('KICKBOX_API_KEY'); // Lấy API key từ file .env
    }

    public function create(RegisterRequest $registerRequest)
    {
        $data = $registerRequest->validated();

        $email = EmailHelper::trimEmail($data['email']);

        // Kiểm tra email với API Kickbox
        if (!$this->verifyEmail($email)) {
            Log::info("Email không hợp lệ: " . $email);
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

            // Tạo token xác minh email
            $data['email_verification_token'] = Str::random(60);

            // Tạo người dùng
            $user = User::create($data);

            $userRole = Role::findByName('user');
            $user->assignRole($userRole);

            // Gửi sự kiện đăng ký thành công và thiết lập thời gian hết hạn cho token
            $minutes = config('auth.passwords.users.expire');
            UserRegisterdSuccess::dispatch($user, $minutes);

            return ['message' => 'Vui lòng xác thực tài khoản'];
        } catch (\Throwable $th) {
            Log::error("Lỗi hệ thống khi tạo người dùng: " . $th->getMessage());
            return ['message' => 'Lỗi hệ thống'];
        }
    }

    // nerverbounce: 'https://api.neverbounce.com/v4/single/check'
    // Phương thức kiểm tra email qua API Kickbox
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
            Log::info("Kết quả kiểm tra email: ", $result); // Ghi lại kết quả

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
}
