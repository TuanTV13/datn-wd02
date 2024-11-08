<?php

namespace App\Listeners;

use App\Events\EventUpcoming;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendUpcomingEventEmail implements ShouldQueue
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
    public function handle(EventUpcoming $event): void
    {
        foreach ($event->users as $user) {
            $eventUrl = route('client.event.show', $event->event->id);

            try {
                Mail::send('emails.event-upcoming', ['user' => $user, 'event' => $event->event, 'eventUrl' => $eventUrl], function ($message) use ($user, $event) {
                    $message->to($user->email, $user->name)
                            ->subject('Sự kiện sắp diễn ra: ' . $event->event->name);
                });
            } catch (Exception $e) {
                Log::error("Lỗi khi gửi email cho user {$user->name} về sự kiện {$event->event->id}: " . $e->getMessage());
            }
        }
    }    
}
