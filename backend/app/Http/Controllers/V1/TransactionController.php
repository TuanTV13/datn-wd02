<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Repositories\TransactionRepository;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    protected $transactionRepository;

    public function __construct(TransactionRepository $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function index(Request $request)
    {
        $transactions = $this->transactionRepository->getAllTransactions();
        return response()->json($transactions, 200);
    }

    public function show($id)
    {
        $transaction = $this->transactionRepository->findTransactionById($id);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        return response()->json($transaction, 200);
    }

    public function verified($id)
    {
        $transaction = $this->transactionRepository->findTransactionById($id);

        if (!$transaction) {
            return response()->json(['message' => 'Không tìm thấy giao dịch'], 404);
        }

        if($transaction->status == 'completed'){
            return response()->json(['message' => 'Giao dịch đã được xác nhận'], 400);
        }

        $transaction->status = 'completed';

        $transaction->save();

        return response()->json(['message' => 'Xác nhận giao dịch thành công'], 200);
    }

    public function failed($id)
    {
        $transaction = $this->transactionRepository->findTransactionById($id);

        if (!$transaction) {
            return response()->json(['message' => 'Không tìm thấy giao dịch'], 404);
        }

        if($transaction->status == 'completed'){
            return response()->json(['message' => 'Giao dịch đã được xác nhận'], 400);
        }

        $transaction->status = 'failed';

        $transaction->save();

        return response()->json(['message' => 'Hủy giao dịch thành công'], 200);
    }
}
