<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusesTableSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            // Trạng thái sự kiện
            ['name' => 'Đang diễn ra', 'type' => 'event'],
            ['name' => 'Sắp diễn ra', 'type' => 'event'],
            ['name' => 'Đã kết thúc', 'type' => 'event'],
            ['name' => 'Bị hủy', 'type' => 'event'],
            ['name' => 'Chờ duyệt', 'type' => 'event'],
            
            // Trạng thái vé
            ['name' => 'Còn vé', 'type' => 'ticket'],
            ['name' => 'Hết vé', 'type' => 'ticket'],
            ['name' => 'Đã bán', 'type' => 'ticket'],
            ['name' => 'Đã hủy', 'type' => 'ticket'],
            ['name' => 'Đang chờ xử lý', 'type' => 'ticket'],
            
            // Trạng thái voucher
            ['name' => 'Còn hiệu lực', 'type' => 'voucher'],
            ['name' => 'Hết hạn', 'type' => 'voucher'],
            ['name' => 'Đã sử dụng', 'type' => 'voucher'],
            ['name' => 'Đã hủy', 'type' => 'voucher'],
            ['name' => 'Hết lượt sử dụng', 'type' => 'voucher'],
            
            // Trạng thái thanh toán
            ['name' => 'Đang xử lý', 'type' => 'payment'],
            ['name' => 'Thành công', 'type' => 'payment'],
            ['name' => 'Thất bại', 'type' => 'payment'],
            ['name' => 'Đã hoàn tiền', 'type' => 'payment'],
            ['name' => 'Đang chờ xác nhận', 'type' => 'payment'],
            ['name' => 'Chưa thanh toán', 'type' => 'payment'],
        ];

        DB::table('statuses')->insert($statuses);
    }
}

