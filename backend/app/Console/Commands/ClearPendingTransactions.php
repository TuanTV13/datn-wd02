<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClearPendingTransactions extends Command
{
    /**
     * Tên và mô tả của command.
     */
    protected $signature = 'transactions:clear-pending';
    protected $description = 'Xóa các giao dịch không thanh toán sau 30 phút';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Lấy thời gian hiện tại
        $now = Carbon::now();

        // Lấy danh sách các giao dịch trạng thái pending và quá 30 phút
        $transactions = DB::table('transactions')
            ->where('status', 'pending')
            ->where('created_at', '<', $now->subMinutes(30))
            ->get();

        foreach ($transactions as $transaction) {
            // Xóa giao dịch trong bảng transactions
            DB::table('transactions')
                ->where('id', $transaction->id)
                ->delete();

            $this->info("Đã xóa giao dịch ID: {$transaction->id}");
        }

        $this->info('Hoàn thành việc xóa các giao dịch pending quá 30 phút.');
    }
}
