<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    /**
     * Verify the user's email address.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $token
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request, $token)
    {
        // Tìm người dùng dựa trên token xác thực
        $user = User::where('email_verification_token', $token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Token xác thực không hợp lệ.'
            ], 400);
        }

        // Kiểm tra xem email đã được xác thực chưa
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Tài khoản của bạn đã được xác thực trước đó.'
            ]);
        }

        // Xác thực email và cập nhật thông tin
        $user->email_verified_at = now();
        $user->email_verification_token = null; // Xóa token xác thực sau khi đã xác thực
        $user->save();

        return response()->json([
            'message' => 'Tài khoản của bạn đã được xác thực thành công.'
        ]);
    }
}


