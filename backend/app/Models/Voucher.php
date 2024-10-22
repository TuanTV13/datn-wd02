<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'creator_id',
        'event_id',
        'status',
        'code',
        'description',
        'discount_type',
        'discount_value',
        'min_order_value',
        'max_order_value',
        'issue_quantity',
        'start_time',
        'end_time',
        'used_limit'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function events()
    {
        return $this->belongsToMany(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot(['voucher_id', 'used_count', 'used_at'])
            ->withTimestamps();
    }
}
