<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'event_id',
        'ticket_type_id',
        'status_id',
        'price',
        'quantity',
        'available_quantity',
        'seat_location',
        'sale_start',
        'sale_end',
        'description'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function type()
    {
        return $this->belongsTo(TicketType::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

}
