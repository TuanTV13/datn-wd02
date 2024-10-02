<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancellationReason extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'reason'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
