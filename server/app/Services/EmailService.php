<?php

namespace App\Services;

use App\Services\UserService;
use Illuminate\Support\Facades\Mail;
use App\Mail\CreateAdminPasswordEmail;

class EmailService
{

    public function sendEmailToCreatePassword($newAdmin)
    {
        $userService = new UserService;
        $token = $userService->generateTokenForPassword($newAdmin->id);
        Mail::to($newAdmin->email)->send(new CreateAdminPasswordEmail($newAdmin, $token));
    }
}
