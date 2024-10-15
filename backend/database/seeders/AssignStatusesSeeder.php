<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignStatusesSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = DB::table('statuses')->get();

        // Gán trạng thái cho Event
        foreach ($statuses as $status) {
            if ($status->type === 'event') {
                DB::table('model_has_statuses')->insert([
                    'model_id' => 1, // Thay đổi ID của sự kiện nếu cần
                    'status_id' => $status->id,
                    'model_type' => 'App\Models\Event', // Thay đổi theo tên model Event
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Gán trạng thái cho Ticket
        foreach ($statuses as $status) {
            if ($status->type === 'ticket') {
                DB::table('model_has_statuses')->insert([
                    'model_id' => 2, // Thay đổi ID của vé nếu cần
                    'status_id' => $status->id,
                    'model_type' => 'App\Models\Ticket', // Thay đổi theo tên model Ticket
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Gán trạng thái cho Voucher
        foreach ($statuses as $status) {
            if ($status->type === 'voucher') {
                DB::table('model_has_statuses')->insert([
                    'model_id' => 3, // Thay đổi ID của voucher nếu cần
                    'status_id' => $status->id,
                    'model_type' => 'App\Models\Voucher', // Thay đổi theo tên model Voucher
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Gán trạng thái cho Payment
        // foreach ($statuses as $status) {
        //     if ($status->type === 'payment') {
        //         DB::table('model_has_statuses')->insert([
        //             'model_id' => 4, // Thay đổi ID của payment nếu cần
        //             'status_id' => $status->id,
        //             'model_type' => 'App\Models\Payment', // Thay đổi theo tên model Payment
        //             'created_at' => now(),
        //             'updated_at' => now(),
        //         ]);
        //     }
        // }
    }
}
