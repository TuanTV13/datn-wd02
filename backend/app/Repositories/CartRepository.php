<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;

class CartRepository
{
    protected $cart;
    protected $cartItem;

    public function __construct(Cart $cart, CartItem $cartItem)
    {
        $this->cart = $cart;
        $this->cartItem = $cartItem;
    }

    public function getCart($userId)
    {
        return $this->cart->with('cartItems')->where('user_id', $userId)->first();
    }

    public function findCartItemById($cartItemId)
    {
        return $this->cartItem->find($cartItemId);
    }

    public function addTicketToCart($userId, $ticketId, $quantity, $price)
    {
        $cart = $this->getCart($userId);

        if (!$cart) {
            $cart = $this->cart->create(['user_id' => $userId]);
        }

        $cartItem = $cart->cartItems()->where('ticket_id', $ticketId)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cart->cartItems()->create([
                'ticket_id' => $ticketId,
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }

        return $cartItem;
    }

    public function updateCartItem($cartItemId, $newQuantity)
    {
        $cartItem = $this->cartItem->find($cartItemId);

        if (!$cartItem) {
            return false;
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->save();

        return $cartItem;
    }


    public function removeCartItem($cartItemId)
    {
        $cartItem = $this->cartItem->find($cartItemId);

        if (!$cartItem) {
            return false;
        }

        $cartItem->delete();

        return true;
    }
}
