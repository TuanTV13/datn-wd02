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
        // Tìm kiếm giao dịch theo ID được cung cấp
        $transaction = $this->transactionRepository->findTransactionById($id);

        // Kiểm tra nếu giao dịch không tồn tại, trả về thông báo lỗi kèm mã HTTP 404
        if (!$transaction) {
            return response()->json(['message' => 'Không tìm thấy giao dịch'], 404);
        }

        // Kiểm tra nếu trạng thái giao dịch đã hoàn thành, trả về thông báo lỗi kèm mã HTTP 400
        if ($transaction->status == 'completed') {
            return response()->json(['message' => 'Giao dịch đã được xác nhận'], 400);
        }

        // Cập nhật trạng thái giao dịch thành 'failed' (thất bại)
        $transaction->status = 'failed';

        // Lưu thay đổi vào cơ sở dữ liệu
        $transaction->save();

        // Trả về thông báo thành công kèm mã HTTP 200
        return response()->json(['message' => 'Hủy giao dịch thành công'], 200);
    }


    // Lấy thông tin giao dịch theo ID

    public function showTransaction($id)
    {
        // Truy vấn giao dịch theo ID với mối quan hệ 'event'
        $transaction = Transaction::where('id', $id)->with('event') // Load related event
            ->select('id', 'event_id', 'total_amount', 'payment_method', 'status', 'created_at') // Chỉ lấy các cột cần thiết
            ->first(); // Lấy bản ghi đầu tiên hoặc null

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }
        // Trả về thông tin giao dịch cùng với tên sự kiện và các chi tiết khác
        return response()->json([
            'id' => $transaction->id, // ID giao dịch
            'event_name' => $transaction->event->name, // Tên sự kiện liên kết với giao dịch
            'transaction_time' => $transaction->created_at, // Thời gian giao dịch được tạo
            'total_amount' => $transaction->total_amount, // Tổng số tiền của giao dịch
            'payment_method' => $transaction->payment_method, // Phương thức thanh toán
            'status' => $transaction->status, // Trạng thái giao dịch
        ]);
    }
}
