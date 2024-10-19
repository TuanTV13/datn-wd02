<?php

namespace App\Http\Controllers\V1\Client;

use App\Enums\PaymentMethod;
use App\Enums\TransactionStatus;
use App\Http\Controllers\Controller;
use App\Repositories\CartRepository;
use App\Repositories\TicketRepository;
use App\Repositories\TransactionRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $cartRepository;
    protected $ticketRepository;
    protected $transactionRepository;
    protected $userRepository;

    public function __construct(CartRepository $cartRepository, TicketRepository $ticketRepository, TransactionRepository $transactionRepository, UserRepository $userRepository)
    {
        $this->cartRepository = $cartRepository;
        $this->ticketRepository = $ticketRepository;
        $this->transactionRepository = $transactionRepository;
        $this->userRepository = $userRepository;
    }

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

        $transactionData = [
            'user_id' => $userId,
            'total_amount' => $totalAmount,
            'payment_method' => PaymentMethod::CASH,
            'status' => TransactionStatus::PENDING,
        ];
        DB::beginTransaction();

        try {
            $transaction = $this->transactionRepository->createTransaction($transactionData);
            $this->processTickets($selectedItems);

            foreach ($selectedItems as $item) {
                $this->cartRepository->removeCartItem($item->id);
            }
            DB::commit();

            return response()->json([
                'message' => 'Mua vé thành công',
                'total_amount' => $transaction
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function checkoutEvent(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'quantity' => 'required|integer|min:1',
            'guest' => 'boolean',
            'guest_name' => 'required_if:guest,true|string|max:255',
            'guest_email' => 'required_if:guest,true|email|max:255',
            'guest_phone' => 'required_if:guest,true|string|max:15',
        ]);

        $ticket = $this->ticketRepository->find($request->ticket_id);

        if (!$ticket) {
            return response()->json(['message' => 'Vé không tồn tại'], 404);
        }

        if ($ticket->available_quantity < $request->quantity) {
            return response()->json(['message' => 'Số lượng vé không đủ'], 400);
        }

        DB::beginTransaction();
        try {
            $userId = Auth()->user() ? Auth()->user()->id : null;

        if ($request->guest) {

            $existingPhone = $this->userRepository->findByPhone($request->guest_phone);
            $existingEmail = $this->userRepository->findByEmail($request->guest_email);

            if ($existingPhone) {
                return response()->json(['message' => 'Số điện thoại đã được đăng ký'], 400);
            }

            if ($existingEmail) {
                return response()->json(['message' => 'Email đã được đăng ký'], 400);
            }
            $guestData = [
                'name' => $request->guest_name,
                'email' => $request->guest_email,
                'phone' => $request->guest_phone,
            ];

            $user = $this->userRepository->create($guestData);
            $userId = $user->id;
        }

        $totalAmount = $ticket->price * $request->quantity;

        $transactionData = [
            'user_id' => $userId,
            'total_amount' => $totalAmount,
            'payment_method' => PaymentMethod::CASH,
            'status' => TransactionStatus::PENDING,
        ];

        $transaction = $this->transactionRepository->createTransaction($transactionData);

        $ticket->available_quantity -= $request->quantity;
        if ($ticket->available_quantity == 0) {
            $ticket->status = "sold_out";
        }
        $ticket->save();

        DB::commit();

        return response()->json([
            'message' => 'Mua vé thành công từ sự kiện',
            'total_amount' => $transaction
        ], 200);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error("errors" . $e->getMessage());
        }
    }
}
