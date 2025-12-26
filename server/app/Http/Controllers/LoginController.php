<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Models\UserPermission;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales proporcionadas son incorrectas.',
            ], 401);
        }

        $permissions = $user->permissions()->pluck('name')->toArray();

        $token = $user->createToken('auth_token', $permissions, now()->addDays(30))->plainTextToken;

        $formattedPermissions = array_fill_keys($permissions, true);


        return response()->json(array_merge([
            'message' => 'Autenticado con éxito',
            'token' => $token,
            'token_expires_at' => now()->addDays(30),
            'fullname' => $user->fullname,
            'email' => $user->email,
            'type' => $user->type,
            'role' => $user->role,


        ], $formattedPermissions));
    }

    public function refreshToken(Request $request)
    {

        try {

            $request->validate([
                'token' => 'required|string'
            ]);

            $userService = new UserService;

            $data = $userService->refreshToken($request->token);

            return response()->json(array_merge([

                'success' => true,
                'message' => 'Token actualizado con exito',

            ], $data));
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {

            Log::info('Error al refrescar token: ', ['message' => $e->getMessage(), 'code' => $e->getCode()]);

            if ($e->getCode() == 401) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ]);
            } else {

                return response()->json([
                    'valid' => false,
                    'message' => 'No se ha podido refrescar el token'
                ], 500);
            }
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }
}
