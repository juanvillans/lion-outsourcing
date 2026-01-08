<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'email',
        'fullname',
        'phone_number',
        'industry_id',
        'area_id',
        'academic_title',
        'english_level',
        'linkedin_url',
        'website_url',
        'localization',
        'desired_monthly_income',
        'cv',
        'photo',
        'skills',
        'years_of_experience',
        'employee_request_id'
    ];


    protected $casts = [
        'skills' => 'array',
        'desired_monthly_income' => 'integer'
    ];


    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }
    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function workteams()
    {
        return $this->belongsToMany(WorkTeam::class, 'employee_work_teams');
    }
}
