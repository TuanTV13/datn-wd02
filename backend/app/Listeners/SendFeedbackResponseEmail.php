<?php 

namespace App\Listeners;

use App\Events\FeedbackReplied;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeedbackResponseMail;
use Illuminate\Support\Facades\Log;

class SendFeedbackResponseEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(FeedbackReplied $event)
    {
        Log::info($event->feedback);
        Mail::send('emails.feedback_response', ['feedback' => $event->feedback], function ($message) use ($event) {
            $message->to($event->feedback->user->email)
                    ->subject('Phản hồi của bạn đã được ghi nhân');
        });
    }
}