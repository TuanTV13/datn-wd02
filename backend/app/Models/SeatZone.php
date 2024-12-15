<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeatZone extends Model
{
    use HasFactory, SoftDeletes;

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
