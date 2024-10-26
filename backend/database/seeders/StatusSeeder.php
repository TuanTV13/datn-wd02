<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            // Trạng thái sự kiện     
            ['name' => 'Bản nháp',          'progression' => 'c', 'key_name' => 'draft',        'type' => 'App\Models\Event'],
            ['name' => 'Chờ duyệt',         'progression' => 'c', 'key_name' => 'pending',      'type' => 'App\Models\Event'],
            ['name' => 'Đang hoạt động',    'progression' => 'c', 'key_name' => 'published',    'type' => 'App\Models\Event'],

            ['name' => 'Đang diễn ra',      'progression' => 'd', 'key_name' => 'ongoing',      'type' => 'App\Models\Event'],
            ['name' => 'Sắp diễn ra',       'progression' => 'd', 'key_name' => 'comming_soon', 'type' => 'App\Models\Event'],
            ['name' => 'Đã kết thúc',       'progression' => 'd', 'key_name' => 'completed',    'type' => 'App\Models\Event'],
            ['name' => 'Bị hủy',            'progression' => 'd', 'key_name' => 'canceled',     'type' => 'App\Models\Event'],

            // Trạng thái vé (Ticket)
            ['name' => 'Bản nháp',          'progression' => 'c', 'key_name' => 'draft',        'type' => 'App\Models\Ticket'],
            ['name' => 'Phát hành',         'progression' => 'c', 'key_name' => 'release',      'type' => 'App\Models\Ticket'],
            
            ['name' => 'Sắp diễn ra',       'progression' => 'd', 'key_name' => 'coming_soon',  'type' => 'App\Models\Ticket'],
            ['name' => 'Còn vé',            'progression' => 'd', 'key_name' => 'available',    'type' => 'App\Models\Ticket'],
            ['name' => 'Hết vé',            'progression' => 'd', 'key_name' => 'sold_out',     'type' => 'App\Models\Ticket'],
            ['name' => 'Đã bán',            'progression' => 'd', 'key_name' => 'sold',         'type' => 'App\Models\Ticket'],
            ['name' => 'Đã hủy',            'progression' => 'd', 'key_name' => 'canceled',     'type' => 'App\Models\Ticket'],
            ['name' => 'Đang chờ xử lý',    'progression' => 'd', 'key_name' => 'pending',      'type' => 'App\Models\Ticket'],

            // Trạng thái voucher
            ['name' => 'Bản nháp',          'progression' => 'c', 'key_name' => 'draft',        'type' => 'App\Models\Voucher'],
            ['name' => 'Chờ xử lý',         'progression' => 'c', 'key_name' => 'pending',      'type' => 'App\Models\Voucher'],
            ['name' => 'Phát hành',         'progression' => 'c', 'key_name' => 'published',    'type' => 'App\Models\Voucher'],

            ['name' => 'Còn hiệu lực',      'progression' => 'd', 'key_name' => 'valid',        'type' => 'App\Models\Voucher'],
            ['name' => 'Hết hạn',           'progression' => 'd', 'key_name' => 'expired',      'type' => 'App\Models\Voucher'],
            ['name' => 'Đã sử dụng',        'progression' => 'd', 'key_name' => 'used',         'type' => 'App\Models\Voucher'],
            ['name' => 'Đã hủy',            'progression' => 'd', 'key_name' => 'canceled',     'type' => 'App\Models\Voucher'],
            ['name' => 'Hết lượt sử dụng',  'progression' => 'd', 'key_name' => 'out_of_uses',  'type' => 'App\Models\Voucher'],

            // Trạng thái thanh toán (Payment)
            ['name' => 'Đang xử lý',        'progression' => 'd', 'key_name' => 'processing',   'type' => 'App\Models\Payment'],
            ['name' => 'Thành công',        'progression' => 'd', 'key_name' => 'successful',   'type' => 'App\Models\Payment'],
            ['name' => 'Thất bại',          'progression' => 'd', 'key_name' => 'failed',       'type' => 'App\Models\Payment'],
            ['name' => 'Đã hoàn tiền',      'progression' => 'd', 'key_name' => 'refunded',     'type' => 'App\Models\Payment'],
            ['name' => 'Đang chờ xác nhận', 'progression' => 'd', 'key_name' => 'awaiting_confirmation', 'type' => 'App\Models\Payment'],
            ['name' => 'Chưa thanh toán',   'progression' => 'd', 'key_name' => 'unpaid',       'type' => 'App\Models\Payment'],
        ];

        foreach ($statuses as $status) {
            Status::create($status);
        }
    }
}
