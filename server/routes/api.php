<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\GeneralController;


Route::post('login', [LoginController::class, 'login'])->name('login');
Route::post('check-set-password-token', [UserController::class, 'checkSetPasswordToken']);
Route::post('set-password', [UserController::class, 'setPassword']);

Route::prefix('admin')->group(function () {

    Route::get('get_permissions', [GeneralController::class, 'getPermissions']);

    Route::get('admins', [UserController::class, 'indexAdmins']);
    Route::post('admins', [UserController::class, 'storeAdmin']);
    Route::put('admins/{admin}', [UserController::class, 'updateAdmin']);
    Route::delete('admins/{admin}', [UserController::class, 'destroyAdmin']);
})->middleware('auth:sanctum');
