<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Place;
use App\Models\Institution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@waypointer.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'     => 'Demo User',
            'email'    => 'user@waypointer.com',
            'password' => Hash::make('password'),
            'role'     => 'user',
            'email_verified_at' => now(),
        ]);

        $this->call(PlacesAndInstitutionsSeeder::class);
        $this->call(AddImageUrlsSeeder::class);
    }
}