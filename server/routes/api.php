<?php

use App\Http\Controllers\AreaController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EmployeeRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\IndustryController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\WorkTeamController;
use App\Models\WorkTeam;

Route::post('login', [LoginController::class, 'login'])->name('login');
Route::post('check-set-password-token', [UserController::class, 'checkSetPasswordToken']);
Route::post('set-password', [UserController::class, 'setPassword']);


Route::get('get_industries', [IndustryController::class, 'getIndustries']);
Route::get('search_skills', [SkillController::class, 'searchSkills']);
Route::post('check_email', [EmployeeRequestController::class, 'checkEmail'])->middleware('throttle:10,1');
Route::post('generate_request', [EmployeeRequestController::class, 'store']);


Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::post('refresh_token', [LoginController::class, 'refreshToken'])->name('refresh_token');
    Route::post('logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('get_permissions', [GeneralController::class, 'getPermissions']);


    // Manejar Industrias
    Route::post('industries', [IndustryController::class, 'store'])->name('industry.store');
    Route::put('industries/{industry}', [IndustryController::class, 'update'])->name('industry.update');
    Route::delete('industries/{industry}', [IndustryController::class, 'destroy'])->name('industry.destroy');

    // Manejar areas
    Route::get('areas', [AreaController::class, 'index'])->name('area.index');
    Route::post('areas', [AreaController::class, 'store'])->name('area.store');
    Route::put('areas/{area}', [AreaController::class, 'update'])->name('area.update');
    Route::delete('areas/{area}', [AreaController::class, 'destroy'])->name('area.destroy');

    // Manejar skills
    Route::get('skills', [SkillController::class, 'index'])->name('skill.index');
    Route::get('skills/newskills', [SkillController::class, 'getNewSkills'])->name('skill.newskills');
    Route::post('skills', [SkillController::class, 'store'])->name('skill.store');
    Route::put('skills/{skill}', [SkillController::class, 'update'])->name('skill.update');
    Route::delete('skills/{skill}', [SkillController::class, 'destroy'])->name('skill.destroy');

    // Manejar usuarios administradores
    Route::get('admins', [UserController::class, 'indexAdmins']);
    Route::post('admins', [UserController::class, 'storeAdmin']);
    Route::put('admins/{admin}', [UserController::class, 'updateAdmin']);
    Route::delete('admins/{admin}', [UserController::class, 'destroyAdmin']);

    // Manejar solicitudes
    Route::get('employee_requests', [EmployeeRequestController::class, 'index']);
    Route::get('employee_request/detail/{employeeRequest}', [EmployeeRequestController::class, 'show']);
    Route::put('employee_requests/{employeeRequest}/status', [EmployeeRequestController::class, 'updateStatus']);

    Route::get('employee_requests/{employeeRequest}/cv/view', [EmployeeRequestController::class, 'viewCv'])->name('employee_requests.cv.view');
    Route::get('employee_requests/{employeeRequest}/cv/download', [EmployeeRequestController::class, 'downloadCv'])->name('employee_requests.cv.download');



    Route::get('employee/{employee}/cv/view', [EmployeeController::class, 'viewCv'])->name('employee.cv.view');
    Route::get('employee/{employee}/cv/download', [EmployeeController::class, 'downloadCv'])->name('employee.cv.download');

    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::put('/employees/{employee}', [EmployeeController::class, 'update']);
    Route::put('/employees/{employee}/cv', [EmployeeController::class, 'updateCV']);
    Route::put('/employees/{employee}/photo', [EmployeeController::class, 'updatePhoto']);

    // Route::get('/employees/stats', [EmployeeController::class, 'getStats']);
    Route::put('/employees/{employee}/skill', [EmployeeController::class, 'updateSkill']);
    Route::get('employees/detail/{employee}', [EmployeeController::class, 'show']);
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy']);


    Route::resource('work_teams', WorkTeamController::class)->except(['edit', 'create']);
});
