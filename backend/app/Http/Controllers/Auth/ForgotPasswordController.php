<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserForgotPassword;
use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    public function sendCode(Request $request)
    {
        $email = $request->validate([
            'email' => 'required|email'
        ]);

        $email = $email['email']; 

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Không tìm thấy tài khoản của bạn '
            ]);
        }

        $cacheKey = $email;
        $cacheTTL = 60;
        $maxAttempts = 3;

        $attempts = Cache::get($cacheKey, 0);

        if($attempts >= $maxAttempts){
            return response()->json([
                'message' => 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau ' . $cacheTTL . ' phút'
            ], 429);
        }

        $minutes = config('auth.passwords.users.expire');
        // event(new UserForgotPassword($user, $minutes));
        UserForgotPassword::dispatch($user, $minutes);

        Cache::put($cacheKey, $attempts + 1, now()->addMinute($cacheTTL));

        return response()->json([
            'message' => 'Mã xác thực đã được gửi vào email của bạn, vui lòng kiểm tra'
        ]);
    }


    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'password' => 'required|min:6|confirmed',
            'verification_code' => 'required|min:6'
        ]);

        $resetEntry = DB::table('password_reset_tokens')
            ->where('token', $data['verification_code'])
            ->first();

        if (!$resetEntry) {
            return response()->json(['message' => 'Mã xác thực không hợp lệ.'], 404);
        }

        $tokenCreatedAt = Carbon::parse($resetEntry->created_at);
        $tokenExpiration = config('auth.passwords.users.expire');
        $expiresAt = $tokenCreatedAt->addMinutes($tokenExpiration);

        if (Carbon::now()->isAfter($expiresAt)) {
            DB::table('password_reset_tokens')->where('token', $data['verification_code'])->delete();
            return response()->json([
                'message' => 'Mã xác thực hết hạn'
            ], 400);
        }

        $user = User::where('email', $resetEntry->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        // Mã hóa password trước khi lưu vào db
        $user->password = Hash::make($data['password']);
        $user->save();

        // Xóa token sau khi sử dụng
        DB::table('password_reset_tokens')->where('email', $resetEntry->email)->delete();

        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công'], 200);
    }
}
