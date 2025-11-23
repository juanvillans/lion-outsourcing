<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\EmailService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\AdminResource;
use App\Http\Requests\getAdminsRequest;
use App\Http\Requests\storeAdminRequest;
use App\Http\Requests\setPasswordRequest;
use App\Http\Requests\updateAdminRequest;
use App\Http\Requests\checkSetPasswordTokenRequest;

class UserController extends Controller
{
    private $userService;

    public function __construct()
    {
        $this->userService = new UserService;
    }

    public function indexAdmins(getAdminsRequest $request)
    {

        $admins = $this->userService->getAdmins($request->validated());
        $results = [];

        if (count($admins) > 1) {

            $results = AdminResource::collection($admins);
        } else if (count($admins) === 1) {
            $results[] = new AdminResource($admins->first());
        }

        return response()->json([
            'message' => 'OK',
            'admins' => $results
        ]);
    }

    public function storeAdmin(storeAdminRequest $request)
    {
        try {
            DB::beginTransaction();
            $newAdmin = $this->userService->storeAdmin($request->validated());
            $mailjetService = new EmailService;
            $mailjetService->sendEmailToCreatePassword($newAdmin);

            DB::commit();
            return response()->json(['message' => 'Correo enviado con éxito']);
        } catch (Exception $e) {

            DB::rollback();
            Log::error('Error creando usuario: ', ['message' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error al crear el administrador',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function updateAdmin(updateAdminRequest $request, $admin)
    {
        try {
            DB::beginTransaction();

            $admin = User::where('id', $admin)->first();

            if (!isset($admin->id)) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            $this->userService->updateAdmin($request->validated(), $admin);

            DB::commit();

            return response()->json(['message' => 'Actualizado con éxito']);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error actualizando administrador: ', [
                'admin_id' => $admin,
                'message' => $e->getMessage(),
                'data' => $request->validated()
            ]);

            return response()->json([
                'message' => 'Error al actualizar el administrador',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function destroyAdmin($admin)
    {
        try {
            DB::beginTransaction();

            $admin = User::where('id', $admin)->first();

            if (!isset($admin->id)) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            $this->userService->destroyAdmin($admin);

            DB::commit();

            return response()->json(['message' => 'Eliminado con éxito']);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error eliminando administrador: ', [
                'admin_id' => $admin,
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Error al eliminar el administrador',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function checkSetPasswordToken(checkSetPasswordTokenRequest $request)
    {

        $isValid = $this->userService->checkSetPasswordToken($request->token);

        if ($isValid)
            return response()->json(['message' => 'OK']);
        else
            return response()->json(['message' => 'Not valid'], 400);
    }

    public function setPassword(setPasswordRequest $request)
    {

        $this->userService->setPassword($request->validated());

        return response()->json(['message' => 'Contraseña actualizada exitosamente']);
    }
}
