<?php

namespace App\Services;

use App\Models\PasswordGenerateToken;
use App\Models\User;

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

        return $user;
    }

    public function generateTokenForPassword($adminID)
    {
        $token = bin2hex(random_bytes(32));

        PasswordGenerateToken::create([
            'user_id' => $adminID,
            'token' => $token,
            'expires_at' => now()->addMinutes(15)
        ]);

        return $token;
    }
}
