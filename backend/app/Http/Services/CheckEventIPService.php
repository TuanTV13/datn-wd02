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
        if (empty($ipCheckin)) {
            // Duyệt qua tất cả sự kiện để kiểm tra xem có subnets hay không
            foreach ($events as $event) {
                // Kiểm tra sự kiện có subnets hay không
                if ($event->subnets->isEmpty()) {
                    // Thêm sự kiện không có IP vào mảng
                    $eventsWithoutIP[] = $event->name;
                }

            }

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
