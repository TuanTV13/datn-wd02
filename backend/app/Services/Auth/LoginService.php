<?php

namespace App\Services\Auth;

use App\Repositories\Auth\LoginRepository;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

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

        if(!$user){
            return ['status' => false, 'message' => 'Không tìm thấy tài khoản' ];
        }

        if(!Auth::attempt(['email' => $email, 'password' => $password])){
            return ['status' => false, 'message' => 'Mật khẩu không đúng' ];
        }

        $user = Auth::user();

        $token = JWTAuth::fromUser($user);

        return ['status' => true, 'user' => $user, 'token' => $token, 'message' => 'Đăng nhập thành công'];
    }
}