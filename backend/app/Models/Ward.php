<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;

    protected $fillable = [
        'district_id',
        'ward_code',
        'name'
    ];

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
