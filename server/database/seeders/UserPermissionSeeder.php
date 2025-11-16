<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('id', 1)->first();

        $permissions = Permission::get();

        foreach ($permissions as $permission) {
            UserPermission::create(['permission_id' => $permission->id, 'user_id' => $admin->id]);
        }
    }
}
