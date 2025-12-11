<?php

use App\Http\Controllers\EmployeeRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\IndustryController;
use App\Http\Controllers\SkillController;

Route::post('login', [LoginController::class, 'login'])->name('login');
Route::post('check-set-password-token', [UserController::class, 'checkSetPasswordToken']);
Route::post('set-password', [UserController::class, 'setPassword']);


Route::get('get_industries', [IndustryController::class, 'getIndustries']);
Route::get('search_skills', [SkillController::class, 'searchSkills']);
Route::post('generate_request', [EmployeeRequestController::class, 'store']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    Route::post('logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('get_permissions', [GeneralController::class, 'getPermissions']);

    // Manejar usuarios administradores
    Route::get('admins', [UserController::class, 'indexAdmins']);
    Route::post('admins', [UserController::class, 'storeAdmin']);
    Route::put('admins/{admin}', [UserController::class, 'updateAdmin']);
    Route::delete('admins/{admin}', [UserController::class, 'destroyAdmin']);

    // Manejar solicitudes
    Route::resource('employee_requests', EmployeeRequestController::class)->except(['store', 'create', 'update', 'edit']);
    Route::put('employee_requests/{employeeRequest}/status', [EmployeeRequestController::class, 'updateStatus']);
});
