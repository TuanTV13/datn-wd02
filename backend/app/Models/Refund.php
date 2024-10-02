<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status_id',
        'transaction_history_id',
        'customer_payment_info_id',
        'refund_amount',
        'refund_reason'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function transactionHistory()
    {
        return $this->belongsTo(TransactionHistory::class);
    }

    public function customerPayment()
    {
        return $this->belongsTo(CustomerPaymentInfo::class);
    }
}
