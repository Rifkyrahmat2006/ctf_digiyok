<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@ctfd.local',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Binary Dragons Members
        $team1 = Team::where('name', 'Binary Dragons')->first();
        if ($team1) {
            User::create([
                'name' => 'Dragon Master',
                'username' => 'dragonmaster',
                'email' => 'dragon@example.com',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'team_id' => $team1->id,
            ]);
            
            User::create([
                'name' => 'Binary Boss',
                'username' => 'binaryboss',
                'email' => 'binary@example.com',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'team_id' => $team1->id,
            ]);

            User::create([
                'name' => 'Code Breaker',
                'username' => 'codebreaker',
                'email' => 'coder@example.com',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'team_id' => $team1->id,
            ]);
        }

        // Cyber Phantoms Member
        $team2 = Team::where('name', 'Cyber Phantoms')->first();
        if ($team2) {
            User::create([
                'name' => 'Phantom One',
                'username' => 'phantom1',
                'email' => 'phantom1@example.com',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'team_id' => $team2->id,
            ]);
        }

        // Root Access Member
        $team3 = Team::where('name', 'Root Access')->first();
        if ($team3) {
            User::create([
                'name' => 'Rooter',
                'username' => 'rooter',
                'email' => 'root@example.com',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'team_id' => $team3->id,
            ]);
        }
    }
}
