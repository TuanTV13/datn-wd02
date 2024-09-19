<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;

    protected $fillable = ['district_id', 'name', 'ward_code'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
