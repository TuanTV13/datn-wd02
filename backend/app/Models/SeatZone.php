<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeatZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function prices()
    {
        return $this->hasMany(TicketPrice::class, 'seat_zone_id');
    }
}
