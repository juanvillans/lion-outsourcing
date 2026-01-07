<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeWorkTeam extends Model
{
    protected $fillable = [
        'employee_id',
        'work_team_id'
    ];
}
