<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'cpf' => '12345678901',
            'sigle' => 'ADMIN',
            'active' => true,
        ]);

        User::create([
            'name' => 'Common User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'Comum',
            'cpf' => '10987654321',
            'sigle' => 'USER',
            'active' => true,
        ]);
    }
}