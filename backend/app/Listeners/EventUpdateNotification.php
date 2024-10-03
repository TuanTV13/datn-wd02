<?php

namespace App\Listeners;

use App\Events\EventUpdate;
use App\Models\UserEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EventUpdateNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    // /**
    //  * Handle the event.
    //  */

    public function handle(EventUpdate $event): void
    {
        // Lấy thông tin sự kiện
        $eventData = $event->event;

        // Lấy tất cả các bản ghi UserEvent liên quan đến sự kiện
        $userEvents = UserEvent::where('event_id', $eventData->id)->get();

        // Gửi email cho từng người tham gia sự kiện
        foreach ($userEvents as $userEvent) {
            $user = $userEvent->user; // Lấy người dùng từ userEvent

            // Kiểm tra xem người dùng có tồn tại không
            if ($user) {
                // Dữ liệu gửi vào email
                $data = [
                    'user' => $user,
                    'event' => $eventData,
                ];

                // Gửi email thông báo cập nhật sự kiện
                Mail::send('emails.event-updated', $data, function ($message) use ($user, $eventData) {
                    $message->from('no-reply@eventify.com', 'Eventify');
                    $message->to($user->email, $user->name);
                    $message->subject('Cập nhật sự kiện: ' . $eventData->name);
                });
            } else {
                Log::warning('User not found for UserEvent ID: ' . $userEvent->id);
            }
        }
    }
}
