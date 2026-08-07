<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@gyanquest.local');
        $password = env('ADMIN_PASSWORD', 'ChangeMeNow!123');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'GyanQuest Admin'),
                'password' => $password,
                'role' => 'admin',
                'status' => 'approved',
                'approved_at' => now(),
            ]
        );
    }
}
