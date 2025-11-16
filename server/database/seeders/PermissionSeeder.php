<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'allow_talents'],
            ['name' => 'allow_bussinesses'],
            ['name' => 'allow_professions'],
            ['name' => 'allow_handle_users'],
            ['name' => 'allow_handle_exams'],
        ];

        Permission::insert($permissions);
    }
}
