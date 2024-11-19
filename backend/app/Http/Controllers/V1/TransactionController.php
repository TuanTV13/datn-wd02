<?php

namespace App\Http\Controllers\V1;

use App\Events\TransactionVerified;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Repositories\TransactionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    protected $transactionRepository;

    public function __construct(TransactionRepository $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    // Lấy danh sách giao dịch
    public function index(Request $request)
    {
        $transactions = $this->transactionRepository->getAllTransactions();
        return response()->json($transactions, 200);
    }

    // Lấy thông tin giao dịch theo ID
    public function show($id)
    {
        $transaction = $this->transactionRepository->findTransactionById($id);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        return response()->json($transaction, 200);
    }

    // Xác nhận giao dịch
    public function verified($id)
    {
        DB::beginTransaction();
        try {
            $transaction = $this->transactionRepository->findTransactionById($id);

            if (!$transaction) {
                return response()->json(['message' => 'Không tìm thấy giao dịch'], 404);
            }

            if ($transaction->status == 'completed') {
                return response()->json(['message' => 'Giao dịch đã được xác nhận'], 400);
            }

            $transaction->status = 'completed';
            $transaction->save();

            // Phát sự kiện xác nhận giao dịch
            event(new TransactionVerified($transaction));
            DB::commit();
            return response()->json(['message' => 'Xác nhận giao dịch thành công'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("message: " . $e->getMessage());
            return response()->json(['message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    // Hủy giao dịch
    public function failed($id)
    {
        $transaction = $this->transactionRepository->findTransactionById($id);

        if (!$transaction) {
            return response()->json(['message' => 'Không tìm thấy giao dịch'], 404);
        }

        if ($transaction->status == 'completed') {
            return response()->json(['message' => 'Giao dịch đã được xác nhận'], 400);
        }

        $transaction->status = 'failed';
        $transaction->save();

        return response()->json(['message' => 'Hủy giao dịch thành công'], 200);
    }
}
