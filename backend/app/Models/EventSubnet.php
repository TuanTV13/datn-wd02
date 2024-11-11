<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventSubnet extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'subnet'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
