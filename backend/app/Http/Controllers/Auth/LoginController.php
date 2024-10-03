<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\Auth\LoginService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    protected $loginService;

    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
    }

    public function login(LoginRequest $loginRequest)
    {

        $credentials = $loginRequest->all();

        $result = $this->loginService->login($credentials['email'], $credentials['password']);

        if (!$result['status']) {
            // Xử lý các loại lỗi và trả về mã trạng thái tương ứng
            if ($result['message'] === 'Không tìm thấy tài khoản') {
                return response()->json([
                    'message' => $result['message']
                ], 404); // Mã lỗi 404 (Not Found)
            } elseif ($result['message'] === 'Mật khẩu không đúng') {
                return response()->json([
                    'message' => $result['message']
                ], 401); // Mã lỗi 401 (Unauthorized)
            }
    
            // Trả về lỗi chung nếu có lỗi khác
            return response()->json([
                'message' => $result['message']
            ], 400); // Mã lỗi 400 (Bad Request)
        }
    
        // Đăng nhập thành công, trả về token và refresh token
        return response()->json([
            'token' => $result['token'],
            'refresh_token' => $result['refresh_token']
        ], 200); // Mã 200 (OK)
    }

    public function refresh(Request $request)
    {
        // $refreshToken = $request->input('refresh_token');

        $result = $this->loginService->refresh($request);

        if(!$result['status']){
            return response()->json([
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'token' => $result['access_token'],
            'refresh_token' => $result['refresh_token']
        ]);

    }
    
}
