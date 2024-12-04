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
        'status',
        'ticket_type',
    ];

    public function price()
    {
        return $this->hasMany(TicketPrice::class)->with('zone');
    }

    public function zone()
    {
        return $this->belongsTo(SeatZone::class, 'id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'event_users')->withPivot('ticket_id', 'user_id');
    }
}
