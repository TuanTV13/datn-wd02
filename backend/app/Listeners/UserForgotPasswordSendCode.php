<?php

namespace App\Listeners;

use App\Events\UserForgotPassword;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;

class UserForgotPasswordSendCode implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserForgotPassword $event): void
    {
        $user = $event->user;
        $minutes = $event->minutes;

        // Tạo mã xác nhận 6 chữ số ngẫu nhiên
        $verificationCode = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Lưu mã xác nhận vào bảng password_resets hoặc bảng riêng cho mã xác nhận
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $verificationCode,
                'created_at' => Carbon::now(),
            ]
        );

        // Dữ liệu gửi vào email
        $data = [
            'user' => $user,
            'verification_code' => $verificationCode, // Gửi mã cho người dùng
            'minutes' => $minutes
        ];

        // Gửi email chứa mã xác nhận
        Mail::send('emails.send-code', $data, function ($message) use ($user) {
            $message->from('no-reply@eventify.com', 'Eventify');
            $message->to($user->email, $user->name);
            $message->subject('Mã xác thực đổi mật khẩu');
        });
    }
}
