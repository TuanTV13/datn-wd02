<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'ticket_id',
        'ticket_type',
        'ticket_code',
        'checked_in',
        'order_date',
        'original_price',
        'discount_code',
        'amount',
    ];

    protected $casts = [
        'checked_in' => 'boolean',
    ];

    /**
     * Mối quan hệ với bảng Event.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Mối quan hệ với bảng User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mối quan hệ với bảng Ticket.
     */
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
