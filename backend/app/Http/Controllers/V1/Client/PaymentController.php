<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\{TicketRepository, TransactionRepository, UserRepository};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB, Log};
use Exception;

class PaymentController extends Controller
{
    protected $ticketRepository, $transactionRepository, $userRepository;

    public function __construct(TicketRepository $ticketRepo, TransactionRepository $transRepo, UserRepository $userRepo)
    {
        $this->ticketRepository = $ticketRepo;
        $this->transactionRepository = $transRepo;
        $this->userRepository = $userRepo;
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
        ]);
        
        $ticket = $this->ticketRepository->find($request->ticket_id);
        if ($ticket->available_quantity < 1) {
            return response()->json(['message' => 'Số lượng vé không đủ'], 400);
        }

        // Mặc định chỉ cho mua 1 vé
        $totalAmount = $ticket->price;
        session(['checkout_data' => ['ticket_id' => $ticket->id, 'quantity' => 1, 'total_amount' => $totalAmount]]);

        return response()->json(['message' => 'Đã chọn vé', 'total_amount' => $totalAmount]);
    }

    public function processPayment(Request $request)
    {
        $checkoutData = session('checkout_data');
        if (!$checkoutData) {
            return response()->json(['message' => 'Không có thông tin thanh toán'], 400);
        }

        DB::beginTransaction();
        try {
            $ticket = $this->ticketRepository->find($checkoutData['ticket_id']);
            if (!$ticket) {
                return response()->json(['message' => 'Vé không tồn tại'], 404);
            }

            $userId = Auth::check() ? Auth::id() : $this->userRepository->create($request->validate([
                'name' => 'required',
                'email' => 'required|email',
                'phone' => 'required'
            ]))->id;

            $request->validate(['payment_method' => 'required|string|in:cash,zalopay']);
            $ticketCode = strtoupper(uniqid('TICKET-'));

            $transactionData = [
                'user_id' => $userId,
                'ticket_id' => $ticket->id,
                'event_id' => $ticket->event_id,
                'quantity' => 1,
                'ticket_code' => $ticketCode,
                'total_amount' => $checkoutData['total_amount'],
                'payment_method' => $request->payment_method,
                'status' => 'PENDING',
                'order_desc' => 'Thanh toán vé cho sự kiện #' . $ticket->id,
            ];

            // Xử lý thanh toán
            $transaction = $this->transactionRepository->createTransaction($transactionData);
            $ticket->decrement('available_quantity', 1);
            if ($ticket->available_quantity <= 0) {
                $ticket->update(['status' => 'sold_out']);
            }

            DB::commit();
            session()->flush();
            return response()->json(['message' => 'Chờ xác nhận', 'transaction_id' => $transaction->id]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Lỗi xử lý thanh toán sự kiện', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Có lỗi trong quá trình thanh toán'], 500);
        }
    }
}
