<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Category;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        // Lấy danh sách các category có sẵn từ database
        $categories = Category::all();

        // Mảng các tỉnh, huyện, xã giả lập
        $provinces = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'];
        $districts = ['Cầu Giấy', '1', 'Bình Thạnh', 'Sơn Trà'];
        $wards = ['Dịch Vọng', 'Đakao', 'Hòa Cường', 'An Khánh'];

        // Tạo 50 sự kiện giả lập
        for ($i = 0; $i < 50; $i++) {
            // Tạo danh sách diễn giả ngẫu nhiên (giả lập thông tin diễn giả)
            $speakers = [
                [
                    'name' => 'Diễn giả ' . rand(1, 100),
                    'bio' => 'Chuyên gia về công nghệ, kinh nghiệm 10 năm.',
                    'email' => 'speaker' . rand(1, 100) . '@example.com',
                    'phone' => '0123456789',
                    'image_url' => 'https://example.com/speaker' . rand(1, 100) . '.jpg',
                ],
                [
                    'name' => 'Diễn giả ' . rand(101, 200),
                    'bio' => 'Chuyên gia về Marketing và Kinh doanh.',
                    'email' => 'speaker' . rand(101, 200) . '@example.com',
                    'phone' => '0123456789',
                    'image_url' => 'https://example.com/speaker' . rand(101, 200) . '.jpg',
                ],
            ];

            // Lựa chọn ngẫu nhiên số lượng diễn giả cho sự kiện này (1-3 diễn giả)
            $selectedSpeakers = array_slice($speakers, 0, rand(1, 3));

            // Tạo sự kiện và lưu vào database
            $event = Event::create([
                'category_id' => $categories->random()->id,  // Lấy ngẫu nhiên category_id
                'province' => $provinces[array_rand($provinces)],
                'district' => $districts[array_rand($districts)],
                'ward' => $wards[array_rand($wards)],
                'name' => 'Sự kiện công nghệ ' . ($i + 1),
                'description' => 'Một sự kiện hấp dẫn về công nghệ mới nhất.',
                'location' => 'Địa điểm sự kiện số ' . ($i + 1),
                'event_type' => $i % 2 == 0 ? 'online' : 'offline',
                'link_online' => $i % 2 == 0 ? 'https://example.com/event-' . ($i + 1) : null,
                'max_attendees' => rand(50, 500),
                'thumbnail' => 'event-thumbnail-' . ($i + 1) . '.jpg',
                'start_time' => Carbon::now()->addDays(rand(1, 30))->format('Y-m-d H:i:s'),
                'end_time' => Carbon::now()->addDays(rand(1, 30))->addHours(rand(1, 4))->format('Y-m-d H:i:s'),
                'speakers' => json_encode($selectedSpeakers),  // Lưu thông tin diễn giả dưới dạng JSON
            ]);
        }

        $this->command->info('Đã tạo 50 sự kiện thử nghiệm!');
    }
}
