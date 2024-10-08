<?php

namespace App\Listeners;

use App\Events\UserRegisterdSuccess;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class UserRegisterdSuccessVerification implements ShouldQueue
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
    public function handle(UserRegisterdSuccess $event)
    {
        $user = $event->user;
        
        $data = [
            'user' => $user,
            'minutes' => $event->minutes
        ];

        Mail::send('emails.verify-email', $data, function ($message) use ($user){
            $message->from('no-reply@eventify.com', 'Eventify');
            $message->to($user->email, $user->name);
            $message->subject('Thư xác thực email tài khoản');
        });
    }
}
