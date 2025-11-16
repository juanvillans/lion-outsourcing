<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\EmailService;
use App\Http\Resources\AdminResource;
use App\Http\Requests\getAdminsRequest;
use App\Http\Requests\storeAdminRequest;
use App\Http\Requests\updateAdminRequest;

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
        $newAdmin = $this->userService->storeAdmin($request->validated());
        $mailjetService = new EmailService;
        $mailjetService->sendEmailToCreatePassword($newAdmin);

        return response()->json(['message' => 'Correo enviado con éxito']);
    }

    public function updateAdmin(updateAdminRequest $request, $admin)
    {

        $admin = User::where('id', $admin)->first();

        if (!isset($admin->id))
            return response()->json(['message' => 'Usuarion no encontrado'], 404);


        $this->userService->updateAdmin($request->validated(), $admin);

        return response()->json(['message' => 'Actualizado con éxito']);
    }

    public function destroyAdmin($admin)
    {

        $admin = User::where('id', $admin)->first();

        if (!isset($admin->id))
            return response()->json(['message' => 'Usuarion no encontrado'], 404);

        $this->userService->destroyAdmin($admin);

        return response()->json(['message' => 'Eliminado con éxito']);
    }
}
