<?php

namespace App\Http\Controllers;

use App\Http\Requests\getAdminsRequest;
use App\Http\Requests\storeAdminRequest;
use App\Http\Resources\AdminResource;
use App\Services\EmailService;
use App\Services\UserService;

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
}
