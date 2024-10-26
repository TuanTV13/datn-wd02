<?php

namespace App\Listeners;

use App\Events\EventCompleted;
use App\Mail\FeedbackMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
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
            $feedbackUrl = URL::temporarySignedRoute('form.feedback', now()->addMinutes(6), ['event' => $event->event->id, 'user' => $user->id]); 

            Mail::to($user->email)->send(new FeedbackMail($event->event, $user, $feedbackUrl));
        }
    }
}
