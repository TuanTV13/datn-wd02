<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'ticket_id',
        'seat_zone_id',
        'price',
        'quantity',
        'sold_quantity',
        'sale_start',
        'sale_end'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
    public function zone()
    {
        return $this->belongsTo(SeatZone::class, 'seat_zone_id');
    }
}
