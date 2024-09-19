<?php

namespace App\Services\Auth;

use App\Models\RefreshToken;
use App\Models\User;
use App\Repositories\Auth\LoginRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class LoginService
{
    protected $loginRepository;

    public function __construct(LoginRepository $loginRepository)
    {
        $this->loginRepository = $loginRepository;
    }

    public function login($email, $password)
    {
        $user = $this->loginRepository->findByEmail($email);

        // Không tìm thấy tài khoản
        if (!$user) {
            return ['status' => false, 'message' => 'Không tìm thấy tài khoản'];
        }

        // Mật khẩu sai
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            return ['status' => false, 'message' => 'Mật khẩu không đúng'];
        }

        // Lấy thông tin user 
        $user = Auth::user();

        // Tạo access token từ JWTAuth
        $token = JWTAuth::fromUser($user);

        return [
            'status' => true,
            'user' => $user,
            'token' => $token,
            'message' => 'Đăng nhập thành công',
            'refresh_token' => $this->refreshToken($user->id)
        ];
    }

    public function refreshToken($userId)
    {
        // Xóa refresh token cũ
        RefreshToken::where('user_id', $userId)->delete();

        // Tạo mới
        $refreshToken = Str::random(50);
        // Thời gian trong config jwt
        $expiresAt = Carbon::now()->addMinute(config('JWT_REFRESH_TTL'));

        RefreshToken::create([
            'user_id' => $userId,
            'token' => $refreshToken,
            'expires_at' => $expiresAt
        ]);

        return $refreshToken;
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        if (!$refreshToken) {
            return ['status' => false, 'message' => 'Không tìm thấy refreshToken'];
        }

        try {

            // Tìm refresh token trong cơ sở dữ liệu
            $storedToken = RefreshToken::where('token', $refreshToken)->first();

            // Kiểm tra xem có hợp lệ 
            if (!$storedToken) {
                return ['status' => false, 'message' => 'Refresh Token không hợp lệ'];
            }

            // Kiểm tra user theo refresh token
            $user = User::find($storedToken->user_id);
            if (!$user) {
                return ['status' => false, 'message' => 'Tài khoản không tồn tại'];
            }

            // Xóa rf token đã sử dụng
            $storedToken->delete();

            // Tọa mới token và rf token
            $newAccessToken = auth('api')->login($user);
            $newRefreshToken = $this->refreshToken($user->id);

            return ['status' => true, 'access_token' => $newAccessToken, 'refresh_token' => $newRefreshToken];
        } catch (TokenExpiredException $exp) {
            return ['status' => false, 'message' => 'Refresh Token hết hạn'];
        } catch (JWTException $e) {
            return ['status' => false, 'message' => 'Refresh Token không hợp lệ'];
        }
    }
}
