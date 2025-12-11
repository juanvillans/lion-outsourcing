<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeRequest extends Model
{
    protected $fillable = [
        'email',
        'fullname',
        'password',
        'phone_number',
        'status',
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
        'new_skills',
        'years_of_experience'
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'skills' => 'array',
        'new_skills' => 'array',
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
}
