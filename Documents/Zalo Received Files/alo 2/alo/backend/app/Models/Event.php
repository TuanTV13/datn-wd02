<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'province',
        'district',
        'ward',
        'status',
        'speakers',
        'name',
        'description',
        'thumbnail',
        'start_time',
        'end_time',
        'location',
        'event_type',
        'link_online',
        'max_attendees',
        'display_header',
    ];

    protected $casts = [
        'display_header' => 'boolean',
    ];

    protected function endTime(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value)->setSeconds(0)->format('Y-m-d H:i:s') : Carbon::now()->format('Y-m-d H:i:s'),
            set: fn($value) => $value ? Carbon::parse($value)->setSeconds(0)->format('Y-m-d H:i:s') : Carbon::now()->format('Y-m-d H:i:s'),
        );
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'event_id', 'id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'event_users');
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    public function registrants()
    {
        return $this->hasMany(EventUser::class);
    }
}
