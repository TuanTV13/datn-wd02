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

        // Lấy danh sách các sự kiện bắt đầu trước 2 ngày nữa và có quan hệ với subnets
        $events = Event::where('start_time', '<=', $twoDaysLater)->where('status', 'confirmed')->with('subnets')->get();

        // Duyệt qua tất cả sự kiện để kiểm tra xem có subnets hay không
        foreach ($events as $event) {
            // Kiểm tra sự kiện có subnets hay không
            if ($event->subnets->isEmpty()) {
                // Thêm sự kiện không có IP vào mảng
                $eventsWithoutIP[] = $event->name;
            }
        }

        // Nếu có sự kiện không có IP, ghi log và trả kết quả
        if (!empty($eventsWithoutIP)) {
            Log::info('Các sự kiện sau chưa có địa chỉ IP cục bộ cho check-in:', $eventsWithoutIP);

            return [
                'status' => 'warning',
                'message' => 'Các sự kiện sau chưa có địa chỉ IP cục bộ:',
                'events' => $eventsWithoutIP
            ];
        }

        // Nếu tất cả sự kiện đã có IP, ghi log và trả kết quả
        Log::info('Tất cả các sự kiện đã có địa chỉ IP cục bộ.');
        return [
            'status' => 'success',
            'message' => 'Tất cả các sự kiện đã có địa chỉ IP cục bộ.'
        ];
    }
}
