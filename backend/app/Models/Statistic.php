<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'total_attendees',
        'total_revenue',
        'feedback_count',
        'feedback_score'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
