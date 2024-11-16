<?php

namespace Database\Seeders;

use App\Enums\EventStatus;
use Illuminate\Database\Seeder;
use App\Models\Event;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run()
    {
        // Tạo 10 sự kiện
        for ($i = 0; $i < 10; $i++) {
            $event = Event::create([
                'category_id' => rand(1, 5), // id danh mục sự kiện
                'province' => 'Sample Province', // tỉnh
                'district' => 'Sample District', // quận
                'ward' => 'Sample Ward', // phường
                'status' => Arr::random([EventStatus::PENDING, EventStatus::CONFIRMED]), // trạng thái sự kiện
                'speakers' => json_encode(['Speaker ' . ($i + 1), 'Speaker ' . ($i + 2)]), // danh sách diễn giả
                'name' => 'Event ' . ($i + 1), // tên sự kiện
                'description' => 'This is a description for event ' . ($i + 1), // mô tả sự kiện
                'thumbnail' => 'https://khoinguonsangtao.vn/wp-content/uploads/2022/08/anh-que-huong-mien-tay-yen-binh.jpg', // URL hình ảnh sự kiện
                'start_time' => now()->addDays(rand(1, 30)), // thời gian bắt đầu
                'end_time' => now()->addDays(rand(31, 60)), // thời gian kết thúc
                'location' => 'Location ' . ($i + 1), // địa điểm
                'event_type' => Arr::random(['online', 'offline']), // loại sự kiện
                'link_online' => Str::random(10) . '.com', // link online nếu sự kiện là online
                'max_attendees' => rand(50, 200), // số lượng người tham gia tối đa
                'display_header' => Arr::random([0, 1]), // hiển thị header hay không
            ]);
        }
    }
}
