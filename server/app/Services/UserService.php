<?php

namespace App\Services;

use App\Models\User;
use App\Models\Permission;
use App\Models\UserPermission;
use Illuminate\Support\Facades\Log;
use App\Models\PasswordGenerateToken;
use Illuminate\Support\Facades\Hash;

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
