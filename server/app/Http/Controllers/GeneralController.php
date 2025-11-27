<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function getPermissions()
    {
        $permissions = Permission::get();

        return response()->json([
            'permissions' =>  $permissions
        ], 200);
    }
}
