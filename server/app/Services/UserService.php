<?php

namespace App\Services;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Permission;
use App\Models\UserPermission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\PasswordGenerateToken;
use Laravel\Sanctum\PersonalAccessToken;

class UserService
{

    /**
     * Obtiene los administradores con filtros opcionales.
     *
     * @param array|null $params
     * @return Collection
     */

    public function getAdmins($params = null)
    {


        $query = User::administrators()->with('permissions');

        $query->when($params, function ($query, $params) {
            if (isset($params['admin_id'])) {
                $query->where('id', $params['admin_id']);
            }
        });

        return $query->get();
    }

    public function storeAdmin($data)
    {
        $user = User::create($data);

        $this->givePermissions($user->id, $data['permission_names']);

        return $user;
    }

    public function updateAdmin($data, $admin)
    {
        $admin->update($data);


        if (array_key_exists('permission_names', $data)) {
            $this->deletePermissions($admin->id);
            $this->givePermissions($admin->id, $data['permission_names']);
        }

        return $admin;
    }

    public function destroyAdmin($admin)
    {

        $this->deletePermissions($admin->id);
        $admin->delete();

        return 0;
    }

    public function generateTokenForPassword($adminID)
    {
        $token = bin2hex(random_bytes(32));

        PasswordGenerateToken::create([
            'user_id' => $adminID,
            'token' => $token,
            'expires_at' => now()->addMinutes(180)
        ]);

        return $token;
    }

    public function checkSetPasswordToken($token)
    {
        $token = PasswordGenerateToken::where('token', $token)
            ->where('expires_at', '>', now())
            ->with('user')
            ->first();

        return ['status' => isset($token->id), 'fullname' => $token->user->fullname ?? null];
    }

    public function setPassword($data)
    {
        $token = PasswordGenerateToken::where('token', $data['token'])
            ->where('expires_at', '>', now())
            ->first();

        $user = User::where('id', $token->user_id)->first();

        $user->update(['password' => Hash::make($data['password'])]);

        $token->delete();

        return 0;
    }

    public function refreshToken(string $token): array
    {
        $currentToken = PersonalAccessToken::findToken($token);

        // Verificar si el token existe
        if (!$currentToken) {
            throw new Exception('Token inválido o no encontrado', 401);
        }

        $user = $currentToken->tokenable;

        if (!$user instanceof User) {
            throw new Exception('Usuario asociado al token no encontrado', 401);
        }

        $tokenCreatedAt = Carbon::parse($currentToken->created_at);
        $tokenExpiresAt = $tokenCreatedAt->copy()->addDays(30);

        if ($tokenExpiresAt->isPast()) {
            $currentToken->delete();
            throw new Exception('Token expirado. Por favor inicie sesión nuevamente.', 401);
        }

        // Revocar el token actual
        $currentToken->delete();

        // Crear nuevo token con sus permisos
        $permissions = $user->permissions()->pluck('name')->toArray();

        $newToken = $user->createToken('auth_token', $permissions, now()->addDays(30))->plainTextToken;

        $formattedPermissions = array_fill_keys($permissions, true);


        // Registrar el refresh para auditoría
        Log::info('Token refrescado', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return array_merge([
            'token' => $newToken,
            'token_expires_at' => now()->addDays(30)->toISOString(),
            'fullname' => $user->fullname,
            'email' => $user->email,
            'type' => $user->type,
            'role' => $user->role,
        ], $formattedPermissions);
    }

    private function givePermissions($userID, $permissions)
    {
        $permissions = Permission::whereIn('name', $permissions)->get()->pluck('id')->toArray();
        $date = now();

        $userPermissions = array_map(function ($permissionId) use ($userID, $date) {
            return [
                'user_id' => $userID,
                'permission_id' => $permissionId,
                'created_at' => $date,
                'updated_at' => $date,
            ];
        }, $permissions);

        UserPermission::insert($userPermissions);
    }

    private function deletePermissions($userID)
    {
        UserPermission::where('user_id', $userID)->delete();

        return 0;
    }
}
