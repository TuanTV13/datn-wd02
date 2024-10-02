<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'status_id',
        'user_id',
        'payment_method_id',
        'discount_code',
        'amount',
        'transaction_date'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
