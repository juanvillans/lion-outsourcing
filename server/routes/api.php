<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginController;


Route::post('login', [LoginController::class, 'login'])->name('login');

Route::prefix('admin')->group(function () {

    Route::get('admins', [UserController::class, 'indexAdmins']);
    Route::post('admins', [UserController::class, 'storeAdmin']);
})->middleware('auth:sanctum');
