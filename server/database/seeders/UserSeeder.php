<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'fullname' => 'adminTesto',
            'email' => 'admin@test.com',
            'role' => 'Admin',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'),
        ]);
    }
}
