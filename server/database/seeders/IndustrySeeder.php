<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            ['name' => 'Petróleo y gas'],
            ['name' => 'Energia electrica'],
            ['name' => 'Servicios Generales']
        ];

        Industry::insert($industries);
    }
}
