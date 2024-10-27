<?php

namespace App\Http\Controllers\V1\Client;

use App\Events\TransactionVerified;
use App\Http\Controllers\Controller;
use App\Http\Services\PayPalService;
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
        $ticket_id = $checkoutData['ticket_id'];
        if (!$checkoutData) {
            return response()->json(['message' => 'Không có thông tin thanh toán'], 400);
        }

        DB::beginTransaction();
        try {
            $ticket = $this->ticketRepository->find($checkoutData['ticket_id']);
            if (!$ticket) {
                return response()->json(['message' => 'Vé không tồn tại'], 404);
            }

            // Xác nhận người dùng
            $userId = Auth::check() ? Auth::id() : $this->userRepository->create($request->validate([
                'name' => 'required',
                'email' => 'required|email',
                'phone' => 'required'
            ]))->id;

            // Xác nhận phương thức thanh toán
            $request->validate(['payment_method' => 'required|string|in:cash,paypal']);
            $ticketCode = strtoupper(uniqid('TICKET-'));

            // Dữ liệu giao dịch
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

            Log::info('Thông tin vé', ['ticket' => $ticket]);
            Log::info('Thông tin giao dịch', ['transaction_data' => $transactionData]);

            if ($request->payment_method === 'paypal') {
                if (empty($ticket->ticket_type) || empty($checkoutData['total_amount']) || !is_numeric($checkoutData['total_amount'])) {
                    return response()->json(['message' => 'Thông tin vé không đầy đủ'], 400);
                }

                $exchangeRate = 23000; // Giả sử 1 USD = 23,000 VND
                $totalAmountInUSD = $checkoutData['total_amount'] / $exchangeRate;

                $paypalService = new PayPalService();
                $paypalService->setItem([[
                    'name' => 'Vé ' . $ticket->ticket_type,
                    'sku' => $ticket->id,
                    'quantity' => 1,
                    'price' => number_format($totalAmountInUSD, 2, '.', ''),
                ]]);
                $transaction = $this->transactionRepository->createTransaction($transactionData);
                $transaction_id = $transaction->id;
                $paypalService->setReturnUrl(route('payment.success', compact(['transaction_id', 'ticket_id'])))
                    ->setCancelUrl(route('payment.cancel', compact(['transaction_id', 'ticket_id'])));

                $paymentUrl = $paypalService->createPayment('Thanh toán vé cho sự kiện #' . $ticket->id);

                
                $transaction->update(['payment_url' => $paymentUrl, 'transaction_id' => $transaction->id]);
                DB::commit();
                session()->flush();
                return response()->json(['message' => 'Chuyển hướng đến PayPal', 'payment_url' => $paymentUrl]);
            } else {
                $transaction = $this->transactionRepository->createTransaction($transactionData);
                $ticket->decrement('available_quantity', 1);
                if ($ticket->available_quantity <= 0) {
                    $ticket->update(['status' => 'sold_out']);
                }
                DB::commit();
                session()->flush();
                Log::info('Thanh toán thành công', ['transaction_id' => $transaction->id, 'ticket_id' => $ticket->id]);
                return response()->json(['message' => 'Thanh toán thành công', 'transaction_id' => $transaction->id]);
            }
        } catch (Exception $e) {
            Log::error('Lỗi khi gọi API PayPal', [
                'response_code' => $e->getCode(),
                'response_body' => $e->getMessage(),
                'request' => $request->all()
            ]);

            DB::rollBack();
            Log::error('Lỗi xử lý thanh toán sự kiện', ['error' => $e->getMessage(), 'request' => $request->all()]);
            Log::info('PayPal Config', [
                'client_id' => env('PAYPAL_CLIENT_ID'),
                'secret' => env('PAYPAL_CLIENT_SECRET'),
            ]);
            Log::error('Thông tin yêu cầu gửi đến PayPal', ['request' => $request->all()]);

            return response()->json(['message' => 'Có lỗi trong quá trình thanh toán'], 500);
        }
    }

    public function paymentSuccess(Request $request)
    {
        $transactionId = $request->query('transaction_id');
        $ticketId = $request->query('ticket_id');

        if (!$transactionId) {
            return response()->json(['message' => 'Không tìm thấy mã giao dịch'], 400);
        }

        $transaction = $this->transactionRepository->findTransactionById($transactionId);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        $ticket = $this->ticketRepository->find($ticketId);

        $ticket->decrement('available_quantity', 1);
                if ($ticket->available_quantity <= 0) {
                    $ticket->update(['status' => 'sold_out']);
                }
        $transaction->update(['status' => 'COMPLETED']);

        event(new TransactionVerified($transaction));
        return response()->json(['message' => 'Thanh toán thành công!']);
    }

    public function paymentCancel(Request $request)
    {
        $transactionId = $request->query('transaction_id');

        if (!$transactionId) {
            return response()->json(['message' => 'Không tìm thấy mã giao dịch'], 400);
        }

        $transaction = $this->transactionRepository->findTransactionById($transactionId);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        $transaction->update(['status' => 'FAILED']);
        return response()->json(['message' => 'Thanh toán đã bị hủy.']);
    }
}
