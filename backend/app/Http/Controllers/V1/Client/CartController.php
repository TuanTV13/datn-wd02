<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\CartRepository;
use App\Repositories\TicketRepository;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected $cartRepository;
    protected $ticketRepository;

    public function __construct(CartRepository $cartRepository, TicketRepository $ticketRepository)
    {
        $this->cartRepository = $cartRepository;
        $this->ticketRepository = $ticketRepository;
    }

    public function getCart(Request $request)
    {
        $userId = Auth()->user()->id;
        $cart = $this->cartRepository->getCart($userId);

        if (!$cart) {
            return response()->json(['message' => 'Giỏ hàng trống'], 404);
        }

        $items = $cart->cartItems ?? collect();

        return response()->json([
            'cart' => $cart,
            'total_items' => $items->sum('quantity'),
            'total_price' => $items->sum(function ($item) {
                return $item->price * $item->quantity;
            }),
        ], 200);
    }


    public function addToCart(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $ticket = $this->ticketRepository->find($request->ticket_id);

        if ($ticket->status == "pending") {
            return response()->json(['message' => 'Vé chưa được bán'], 400);
        }

        if ($ticket->status == "cancelled") {
            return response()->json(['message' => 'Vé đã bị hủy'], 400);
        }

        if ($ticket->status == "sold_out") {
            return response()->json(['message' => 'Đã bán hết vé'], 400);
        }

        if ($ticket->available_quantity < $request->quantity) {
            return response()->json(['message' => 'Số lượng không đủ'], 400);
        }

        $this->cartRepository->addTicketToCart($request->user()->id, $ticket->id, $request->quantity, $ticket->price);

        return response()->json([
            'message' => 'Thêm vé vào giỏ hàng thành công',
        ]);
    }

    public function increaseQuantity(Request $request, $cart_item_id)
    {
        $cartItem = $this->cartRepository->findCartItemById($cart_item_id);
        if (!$cartItem) {
            return response()->json([
                'error' => 'Không tìm thấy item trong giỏ hàng'
            ]);
        }

        $ticket = $this->ticketRepository->find($cartItem->ticket_id);

        if ($cartItem->quantity + 1 > $ticket->available_quantity) {
            return response()->json(['message' => 'Số lượng không đủ'], 400);
        }

        $newQuantity = $cartItem->quantity + 1;
        $item = $this->cartRepository->updateCartItem($cartItem->id, $newQuantity);

        return response()->json([
            'message' => 'Tăng số lượng thành công',
            'data' => $item
        ]);
    }


    public function decreaseQuantity(Request $request, $cartItemId)
    {
        $cartItem = $this->cartRepository->findCartItemById($cartItemId);

        if (!$cartItem) {
            return response()->json(['message' => 'Mục giỏ hàng không tồn tại'], 404);
        }

        $newQuantity = $cartItem->quantity - 1;

        if ($newQuantity <= 0) {
            $this->cartRepository->removeCartItem($cartItem->id);
            return response()->json([
                'message' => 'Xóa mục giỏ hàng vì số lượng bằng 0',
            ], 200);
        }

        $this->cartRepository->updateCartItem($cartItem->id, $newQuantity);

        return response()->json([
            'message' => 'Giảm số lượng thành công',
        ], 200);
    }
}
