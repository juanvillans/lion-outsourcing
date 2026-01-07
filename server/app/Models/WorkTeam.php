<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkTeam extends Model
{
    protected $fillable = [
        'name'
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_work_teams');
    }
}
