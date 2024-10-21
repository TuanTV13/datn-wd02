<?php

namespace App\Http\Controllers\V1\Client;

use App\Enums\PaymentMethod;
use App\Enums\TransactionStatus;
use App\Http\Controllers\Controller;
use App\Http\Services\PaymentService;
use App\Repositories\CartRepository;
use App\Repositories\TicketRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $cartRepository;
    protected $ticketRepository;
    protected $transactionRepository;
    protected $userRepository;
    protected $paymentService;

    public function __construct(CartRepository $cartRepository, TicketRepository $ticketRepository, TransactionRepository $transactionRepository, UserRepository $userRepository, PaymentService $paymentService)
    {
        $this->cartRepository = $cartRepository;
        $this->ticketRepository = $ticketRepository;
        $this->transactionRepository = $transactionRepository;
        $this->userRepository = $userRepository;
        $this->paymentService = $paymentService;
    }

    // Xác thực vé
    protected function processTickets($selectedItems)
    {
        foreach ($selectedItems as $item) {
            $ticket = $this->ticketRepository->find($item->ticket_id);
            if ($ticket->available_quantity < $item->quantity) {
                throw new \Exception('Số lượng vé không đủ cho vé ID: ' . $item->ticket_id);
            }

            $ticket->available_quantity -= $item->quantity;
            if ($ticket->available_quantity == 0) {
                $ticket->status = "sold_out";
            }
            $ticket->save();
        }
    }

    // Thanh toán qua giỏ hàng
    public function processPayment(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
        ]);

        $checkoutData = session('checkout_data');
        if (!$checkoutData) {
            return response()->json(['message' => 'Không có dữ liệu thanh toán'], 400);
        }

        $cart_item_ids = $checkoutData['cart_item_ids'];
        $totalAmount = $checkoutData['total_amount'];
        $userId = Auth()->user()->id;

        $transactionData = [
            'user_id' => $userId,
            'total_amount' => $totalAmount,
            'status' => TransactionStatus::PENDING,
        ];

        DB::beginTransaction();
        try {
            $transaction = $this->transactionRepository->createTransaction($transactionData);

            $cart = $this->cartRepository->getCart($userId);
            $selectedItems = $cart->cartItems->whereIn('id', $cart_item_ids);

            foreach ($selectedItems as $item) {
                $ticket = $this->ticketRepository->find($item->ticket_id);
                $ticket->available_quantity -= $item->quantity;
                if ($ticket->available_quantity <= 0) {
                    $ticket->status = "sold_out";
                }
                $ticket->save();

                $this->cartRepository->removeCartItem($item->id);
            }
            DB::commit();

            session()->forget('checkout_data');

            return response()->json(['message' => 'Thanh toán thành công'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Có lỗi xảy ra trong quá trình thanh toán', 'error' => $e->getMessage()], 500);
        }
    }

    // Chọn vé trong giỏ trước khi thanh toán
    public function checkoutCart(Request $request)
    {
        $request->validate([
            'cart_item_ids' => 'required|array',
            'cart_item_ids.*' => 'exists:cart_items,id'
        ]);

        $userId = Auth()->user()->id;
        $cart = $this->cartRepository->getCart($userId);

        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json(['message' => 'Giỏ hàng trống'], 400);
        }

        $selectedItems = $cart->cartItems->whereIn('id', $request->cart_item_ids);

        if ($selectedItems->isEmpty()) {
            return response()->json(['message' => 'Không có mục nào được chọn trong giỏ hàng'], 400);
        }

        $totalAmount = $selectedItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        session()->forget('checkout_data');
        session(['checkout_data' => [
            'cart_item_ids' => $request->cart_item_ids,
            'total_amount' => $totalAmount,
        ]]);

        return response()->json([
            'message' => 'Đã chọn sản phẩm thành công',
            'total_amount' => $totalAmount,
            'selected_items' => $selectedItems,
        ], 200);
    }

    // Mua 1 vé
    public function checkoutEvent(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $ticket = $this->ticketRepository->find($request->ticket_id);

        if (!$ticket) {
            return response()->json(['message' => 'Vé không tồn tại'], 404);
        }

        if ($ticket->available_quantity < $request->quantity) {
            return response()->json(['message' => 'Số lượng vé không đủ'], 400);
        }

        $totalAmount = $ticket->price * $request->quantity;

        session()->forget('checkout_data');
        session([
            'ticket_id' => $ticket->id,
            'quantity' => $request->quantity,
            'total_amount' => $totalAmount,
        ]);

        return response()->json([
            'message' => 'Đã chọn vé thành công',
            'ticket_id' => $ticket->id,
            'quantity' => $request->quantity,
            'total_amount' => $totalAmount,
        ], 200);
    }

    // Thanh toán cho mua 1 vé
    public function processEventPayment(Request $request)
    {
        $checkoutData = session()->get('ticket_id');

        if (!$checkoutData) {
            return response()->json(['message' => 'Không có thông tin thanh toán'], 400);
        }

        $ticketId = session('ticket_id');
        $quantity = session('quantity');
        $totalAmount = session('total_amount');

        $ticket = $this->ticketRepository->find($ticketId);

        if (!$ticket) {
            return response()->json(['message' => 'Vé không tồn tại'], 404);
        }

        if (!Auth::check()) {
            $request->validate([
                'guest_name' => 'required|string|max:255',
                'guest_email' => 'required|email|max:255',
                'guest_phone' => 'required|string|max:15',
            ]);

            $guestData = [
                'name' => $request->guest_name,
                'email' => $request->guest_email,
                'phone' => $request->guest_phone,
            ];

            $existingEmail = $this->userRepository->findByEmail($guestData['email']);
            $existingPhone = $this->userRepository->findByPhone($guestData['phone']);

            if ($existingEmail || $existingPhone) {
                return response()->json(['message' => 'Email hoặc số điện thoại đã được đăng ký'], 400);
            }

            $user = $this->userRepository->create($guestData);
            $userId = $user->id;
        } else {
            $userId = Auth::id();
        }

        $transactionData = [
            'user_id' => $userId,
            'ticket_id' => $ticketId,
            'quantity' => $quantity,
            'total_amount' => $totalAmount,
            'payment_method' => PaymentMethod::CASH,
            'status' => TransactionStatus::PENDING,
        ];

        $transaction = $this->transactionRepository->createTransaction($transactionData);

        $ticket->available_quantity -= $quantity;
        if ($ticket->available_quantity <= 0) {
            $ticket->status = 'sold_out';
        }
        $ticket->save();

        session()->forget('checkout_data');

        return response()->json([
            'message' => 'Thanh toán thành công',
            'transaction_id' => $transaction->id,
            'total_amount' => $totalAmount,
        ], 200);
    }

}
