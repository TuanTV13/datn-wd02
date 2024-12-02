<?php

namespace App\Http\Controllers\V1;

use App\Events\TransactionVerified;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Repositories\TransactionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

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
            Log::error("message" . $e->getMessage());
            // Xử lý ngoại lệ và trả về thông báo lỗi
            return response()->json(['message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }


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

 // Lấy thông tin giao dịch theo ID
 
 public function showTransaction($id)
 {
     $transaction = Transaction::where('id', $id)->with('event') // Load related event
     ->select('id', 'event_id', 'total_amount', 'payment_method', 'status', 'created_at') // Chỉ lấy các cột cần thiết   
     ->first(); // Lấy bản ghi đầu tiên hoặc null

         if (!$transaction) {
          return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
      }
     return response()->json([
         'id' => $transaction->id,
         'event_name' => $transaction->event->name, // Only event name
         'transaction_time' => $transaction->created_at, // Format the created_at as transaction time
         'total_amount' => $transaction->total_amount,
         'payment_method' => $transaction->payment_method,
         'status' => $transaction->status,
     ]);
 }

}