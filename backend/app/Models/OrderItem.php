<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'transaction_history_id',
        'amount'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function transactionHistory()
    {
        return $this->belongsTo(TransactionHistory::class);
    }
}
