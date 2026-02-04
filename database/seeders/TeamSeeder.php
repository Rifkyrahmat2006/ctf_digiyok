<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Binary Dragons',
                'code' => 'BD2026',
            ],
            [
                'name' => 'Cyber Phantoms',
                'code' => 'CP2026',
            ],
            [
                'name' => 'Root Access',
                'code' => 'RA2026',
            ],
            [
                'name' => 'Buffer Overflow',
                'code' => 'BO2026',
            ],
            [
                'name' => 'Stack Smashers',
                'code' => 'SS2026',
            ],
            [
                'name' => 'Zero Day Squad',
                'code' => 'ZD2026',
            ],
            [
                'name' => 'Packet Sniffers',
                'code' => 'PS2026',
            ],
            [
                'name' => 'Shell Shocked',
                'code' => 'SH2026',
            ],
        ];

        foreach ($teams as $team) {
            Team::create($team);
        }
    }
}
