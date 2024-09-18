<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\Auth\LoginService;
use Illuminate\Http\Request;

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

        if(!$result['status']){
            return response()->json([
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'message' => $result['message'],
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    }
}
