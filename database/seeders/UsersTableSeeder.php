<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Admin',
                'email' => 'admin@waypointer.com',
                'email_verified_at' => '2026-05-03 21:00:59',
                'password' => '$2y$12$m7Dwbbo3juC3rTkIiPai8ucSaUzVcNsbqeTYf.CB4WU2E2XfBb1Oe',
                'role' => 'admin',
                'remember_token' => NULL,
                'created_at' => '2026-05-03 21:00:59',
                'updated_at' => '2026-05-03 21:00:59',
            ),
            1 => 
            array (
                'id' => 3,
                'name' => 'max',
                'email' => 'max@gmail.com',
                'email_verified_at' => NULL,
                'password' => '$2y$12$mxrO85QZA8rguxhjRil9h.X.01.JxFyZ9qfTHV.Kh/CLiyzwQ6sKi',
                'role' => 'user',
                'remember_token' => NULL,
                'created_at' => '2026-05-03 21:36:06',
                'updated_at' => '2026-05-03 21:36:06',
            ),
        ));
        
        
    }
}