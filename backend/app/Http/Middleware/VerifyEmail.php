<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmail
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = User::where('email', $request->email)->first();;

        if ($user === null) {
            return response()->json(['message' => 'Không tìm thấy tài khoản này'], 404);
        }
        // Kiểm tra xem người dùng có xác thực email chưa
        if (!$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Tài khoản chưa được xác thực'], 403);
        }

        return $next($request);
    }
}
