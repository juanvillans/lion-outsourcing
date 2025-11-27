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
            [
                'name' => 'allow_talents',
                'label' => 'Puede responde solicitudes de talentos',
                'helper_text' => null,
            ],
            [
                'name' => 'allow_bussinesses',
                'label' => 'Puede responder solicitudes de empresas',
                'helper_text' => null,

            ],
            [
                'name' => 'allow_professions',
                'label' => 'Permite crear, editar y eliminar o desabilitar las profesiones ofrecidas, así como las habilidades especificas de cada profesión',
                'helper_text' => 'Permite crear, editar y eliminar o desabilitar las profesiones ofrecidas, así como las habilidades especificas de cada profesión'
            ],
            [
                'name' => 'allow_admins',
                'label' => 'Puede Gestionar administradores',
                'helper_text' => 'Permite crear, editar y eliminar administradores del sistema'
            ],
        ];

        Permission::insert($permissions);
    }
}
