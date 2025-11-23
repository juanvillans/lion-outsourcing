<?php

namespace App\Services;

use Exception;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\CreateAdminPasswordEmail;

class EmailService
{

    public function sendEmailToCreatePassword($newAdmin)
    {
        try {
            $userService = new UserService;
            $token = $userService->generateTokenForPassword($newAdmin->id);
            Mail::to($newAdmin->email)->send(new CreateAdminPasswordEmail($newAdmin, $token));

            return 0;
        } catch (Exception $e) {

            Log::error('Error enviando email de creación de contraseña', [
                'admin_id' => $newAdmin->id,
                'email' => $newAdmin->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception("Error enviando email de creación de contraseña: {$e->getMessage()}");
        }
    }
}
