<?php

namespace App\Services;

use Exception;
use App\Models\User;
use App\Enums\UserTypeEnum;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\CreateAdminPasswordEmail;
use App\Mail\NotifyAdminNewEmployeeRequestEmail;

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

    public function sendEmailToNotifyAdminForNewEmployeeRequest($employeeRequest)
    {

        $admins = User::where('type', UserTypeEnum::Administrador)
            ->whereNotNull('email')
            ->pluck('email')
            ->toArray();

        try {

            if (empty($admins)) {
                Log::warning('No hay administradores para notificar sobre nueva solicitud');
                return false;
            }

            Mail::to($admins)->send(new NotifyAdminNewEmployeeRequestEmail($employeeRequest));

            return 0;
        } catch (Exception $e) {

            Log::error('Error enviando email de notificacion de solicitud de empleado a usuarios admins', [
                'employee_request' => $employeeRequest->id,
                'email' => ['adminEmails' => $admins],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception("Error enviando email de creación de contraseña: {$e->getMessage()}");
        }
    }
}
