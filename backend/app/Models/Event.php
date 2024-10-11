<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'status_id',
        'province_id',
        'district_id',
        'ward_id',
        'name',
        'description',
        'thumbnail',
        'start_time',
        'end_time',
        'location',
        'event_type',
        'link_online',
        'max_attendees',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    public function statuses(): MorphToMany
    {
        return $this->morphToMany(Status::class, 'model');
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function speakers()
    {
        return $this->belongsToMany(Speaker::class, 'event_speakers');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
