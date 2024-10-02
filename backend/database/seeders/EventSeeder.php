<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Event;
use App\Models\Organizer;
use App\Models\Speaker;
use App\Models\Ticket;
use App\Models\SeatLocation;
use App\Models\Voucher;

class EventSeeder extends Seeder
{
    public function run()
    {
        // Tạo một người tổ chức

        // Tạo sự kiện
        $event = Event::create([
            'category_id' => 1,
            'status_id' => 1,
            'province_id' => 1,
            'district_id' => 1,
            'ward_id' => 1,
            'name' => 'Sample Event',
            'description' => 'This is a sample event description.',
            'start_time' => now()->addDays(7),
            'end_time' => now()->addDays(8),
            'location' => 'Sample Location',
            'event_type' => 'offline',
            'max_attendees' => 100,
            'registered_attendees' => 0,
        ]);

        // Tạo diễn giả
        Speaker::create([
            'event_id' => $event->id,
            'name' => 'Sample Speaker',
            'email' => 'speaker@example.com',
            'phone' => '0987654321',
            'profile' => 'This is a sample speaker profile.',
            'image_url' => 'sample-speaker.jpg', // Giả định hình ảnh đã được tải lên
        ]);

        // Tạo vé
        $ticket = Ticket::create([
            'event_id' => $event->id,
            'ticket_type_id' => 1,
            'price' => 100.00,
            'quantity' => 50,
            'available_quantity' => 50,
            'seat_location' => 'Front Row',
            'sale_start' => now(),
            'sale_end' => now()->addDays(7),
            'description' => 'VIP Ticket Description',
        ]);

        // Tạo vị trí ngồi
        SeatLocation::create([
            'ticket_id' => $ticket->id,
            'section' => 'A',
            'seat_number' => '1',
            'status' => true,
        ]);

        // Tạo voucher
        Voucher::create([
            'ticket_id' => $ticket->id,
            'code' => 'DISCOUNT10',
            'discount_amount' => 10.00,
            'expiration_date' => now()->addDays(30),
            'used_limit' => 100,
        ]);
    }
}
