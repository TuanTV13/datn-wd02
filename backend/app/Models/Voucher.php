<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'status_id',
        'code',
        'discount_amount',
        'expiration_date',
        'used_limit'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function statuses(): MorphToMany
    {
        return $this->morphToMany(Status::class, 'model');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_vouchers')
            ->withPivot('used_at');
    }
}
