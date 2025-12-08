<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [

            ['name' => 'Operaciones', 'industry_id' => 1],
            ['name' => 'Producción', 'industry_id' => 1],
            ['name' => 'Perforación y Workover', 'industry_id' => 1],
            ['name' => 'Ingeniería de Yacimientos', 'industry_id' => 1],
            ['name' => 'Ingeniería de Producción', 'industry_id' => 1],
            ['name' => 'Ingeniería de Facilidades / Superficie', 'industry_id' => 1],
            ['name' => 'Mantenimiento Mecánico', 'industry_id' => 1],
            ['name' => 'Mantenimiento Eléctrico', 'industry_id' => 1],
            ['name' => 'Instrumentación y Control', 'industry_id' => 1],
            ['name' => 'Seguridad, Higiene y Ambiente (HSE)', 'industry_id' => 1],
            ['name' => 'Logística y Transporte', 'industry_id' => 1],
            ['name' => 'Oleoductos y Gasoductos', 'industry_id' => 1],
            ['name' => 'Refinación', 'industry_id' => 1],
            ['name' => 'Construcción Industrial', 'industry_id' => 1],
            ['name' => 'Servicios Petroleros Especializados', 'industry_id' => 1],
            ['name' => 'Laboratorio', 'industry_id' => 1],
            ['name' => 'TIC / Sistemas', 'industry_id' => 1],
            ['name' => 'Administración y Soporte', 'industry_id' => 1],
            ['name' => 'Energía y Servicios Auxiliares', 'industry_id' => 1],
            ['name' => 'Relaciones Comunitarias / RRHH / Gestión Social', 'industry_id' => 1],

            // Áreas para Servicios Generales (industry_id: 2)
            ['name' => 'Administración', 'industry_id' => 2],
            ['name' => 'Contabilidad', 'industry_id' => 2],
            ['name' => 'Recursos Humanos', 'industry_id' => 2],
            ['name' => 'Limpieza', 'industry_id' => 2],
            ['name' => 'Seguridad y Vigilancia', 'industry_id' => 2],
            ['name' => 'Logística y Almacén', 'industry_id' => 2],
            ['name' => 'Atención al Cliente', 'industry_id' => 2],
            ['name' => 'Legal', 'industry_id' => 2],
        ];

        Area::insert($areas);
    }
}
