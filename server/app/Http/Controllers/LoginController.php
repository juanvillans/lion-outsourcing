<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Models\UserPermission;
use Illuminate\Support\Facades\Hash;

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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }
}
