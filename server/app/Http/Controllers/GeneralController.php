<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function getPermissions()
    {
        $permissions = Permission::get();

        $permissionsObject = [];
        foreach ($permissions as $permission) {
            $permissionsObject[$permission['name']] = true;
        }

        return response()->json([
            'permissions' => (object) $permissionsObject
        ], 200);
    }
}
