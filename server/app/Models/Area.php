<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $fillable = [
        'name',
        'industry_id'
    ];

    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }
}
