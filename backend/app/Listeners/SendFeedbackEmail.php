<?php

namespace App\Listeners;

use App\Events\EventCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class SendFeedbackEmail implements ShouldQueue
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
    public function handle(EventCompleted $event): void
    {
        foreach ($event->users as $user) {
            $feedbackUrl = URL::temporarySignedRoute('form.feedback', now()->addDays(7), ['event' => $event->event->id, 'user' => $user->id]); 

            Mail::send('emails.email-feedback', ['event' => $event->event, 'user' => $user, 'feedbackUrl' => $feedbackUrl], function ($message) use ($user, $event) {
                $message->to($user->email)
                        ->subject('Cảm ơn bạn đã tham gia sự kiện ' . $event->event->name);
            });
        }
    }
}
