<?php

namespace App\Services\Auth;

use App\Events\UserRegisterdSuccess;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Repositories\Auth\RegisterRepository;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RegisterService
{
    protected $registerRepository;
    protected $api_key;
    protected $client;

    public function __construct(RegisterRepository $registerRepository)
    {
        $this->registerRepository = $registerRepository;
        $this->client = new Client();
        $this->api_key = env('KICKBOX_API_KEY');
    }

    public function create(RegisterRequest $registerRequest)
    {
        $data = $registerRequest->validated();

        if (!$this->verifyEmail($data['email'])) {
            Log::info("Email không hợp lệ: " . $data['email']);
            throw ValidationException::withMessages([
                'email' => 'Email không hợp lệ hoặc không tồn tại. Vui lòng thử lại với một địa chỉ email khác.',
            ]);
        }
        try {

            if ($registerRequest->hasFile('image')) {
                $data['image'] = Storage::put('users', $registerRequest->file('image'));
            }

            $data['password'] = bcrypt($data['password']);

            $data['email_verification_token'] = Str::random(60);

            $user = User::create($data);

            $minutes = config('auth.passwords.users.expire');

            UserRegisterdSuccess::dispatch($user, $minutes);
        } catch (\Throwable $th) {
            return ['message' => 'Lỗi hệ thống'];
        }
    }

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

            $result = json_decode($response->getBody(), true); // Chuyển đổi thành mảng

            // Ghi log kết quả từ API
            Log::info("Kết quả kiểm tra email: ", $result);

            // Trả về true nếu email tồn tại
            return $result['result'] === 'deliverable'; // Sử dụng cú pháp mảng
        } catch (Exception $e) {
            Log::error("Lỗi khi gọi API Kickbox: " . $e->getMessage());
            return false;
        }
    }
}
