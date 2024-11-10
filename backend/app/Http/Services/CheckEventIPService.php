<?php

namespace App\Http\Services;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckEventIPService
{
    public function checkEventsWithoutIP()
    {
        $twoDaysLater = Carbon::now()->addDays(2);
        $eventsWithoutIP = [];

        $events = Event::where('start_time', '<=', $twoDaysLater)->with('subnets')->get();
        // dd($events);
        foreach ($events as $event) {
            $ipCheckin = $event->subnets();

            // dd($ipCheckin);
            if (empty($ipCheckin)) {
                $eventsWithoutIP[] = $event->name;
            }

            // dd($eventsWithoutIP);
        }

        if ($eventsWithoutIP) {
            // Ghi log các sự kiện chưa có IP
            Log::info('Các sự kiện sau chưa có địa chỉ IP cục bộ cho check-in:', $eventsWithoutIP);

            return [
                'status' => 'warning',
                'message' => 'Các sự kiện sau chưa có địa chỉ IP cục bộ:',
                'events' => $eventsWithoutIP
            ];
        }

        Log::info('Tất cả các sự kiện đã có địa chỉ IP cục bộ.');
        return [
            'status' => 'success',
            'message' => ''
        ];
    }
}