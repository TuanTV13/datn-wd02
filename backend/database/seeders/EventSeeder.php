<?php

namespace Database\Seeders;

use App\Enums\EventStatus;
use App\Enums\TicketStatus;
use App\Enums\VoucherStatus;
use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Speaker;
use App\Models\Ticket;
use App\Models\Voucher;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;

class EventSeeder extends Seeder
{
    public function run()
    {
        // Tạo 10 sự kiện
        for ($i = 0; $i < 10; $i++) {
            $event = Event::create([
                'category_id' => rand(1, 5),
                'status' => Arr::random([EventStatus::PENDING, EventStatus::CONFIRMED]),
                'province_id' => 1,
                'district_id' => 1,
                'ward_id' => 1,
                'name' => 'Sample Event ' . ($i + 1), 
                'description' => 'This is a sample event description.',
                'thumbnail' => 'https://images.unsplash.com/photo-1729008014126-c0eb5498663b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
                'start_time' => now()->addDays(7),
                'end_time' => now()->addDays(8),
                'location' => 'Sample Location ' . ($i + 1),
                'event_type' => 'offline',
                'max_attendees' => 100,
                'registed_attendees' => 0,
            ]);

            // Tạo diễn giả
            Speaker::create([
                'name' => 'Sample Speaker ' . ($i + 1),
                'email' => 'speaker' . ($i + 1) . '@example.com',
                'phone' => '098765432' . ($i + 1),
                'profile' => 'This is a sample speaker profile.',
                'image_url' => 'https://images.unsplash.com/photo-1721332153370-56d7cc352d63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3MXx8fGVufDB8fHx8fA%3D%3D', 
            ]);

            // Tạo vé
            $ticket = Ticket::create([
                'event_id' => $event->id,
                'status' => Arr::random([TicketStatus::PENDING, TicketStatus::CONFIRMED]),
                'ticket_type' => 'VIP',
                'price' => 100000,
                'quantity' => 50,
                'available_quantity' => 50,
                'seat_location' => 'Front Row',
                'sale_start' => now()->addDays(2),
                'sale_end' => now()->addDays(6),
                'description' => 'VIP Ticket Description',
            ]);

            // Tạo voucher
            Voucher::create([
                'creator_id' => 3,
                'event_id' => $event->id,
                // 'ticket_id' => $ticket->id,
                'status' => Arr::random([VoucherStatus::DRAFT, VoucherStatus::PENDING, VoucherStatus::PUBLISHED]),
                'code' => Str::random(6),
                'description' => 'This is a sample voucher description.',
                'discount_value' => rand(10, 50),
                'discount_type' => Arr::random(['percent', 'fixed']),
                'min_order_value' => 100000,
                'max_order_value' => 200000,
                'start_time' => now()->addDays(2),
                'end_time' => now()->addDays(6),
                'issue_quantity' => 50,
                'used_limit' => 1,
            ]);
        }
    }
}
