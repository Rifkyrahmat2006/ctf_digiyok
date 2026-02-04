<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ScoreboardService
{
    /**
     * Get full scoreboard with rankings
     */
    public function getScoreboard(): Collection
    {
        return Team::with(['submissions' => function ($query) {
                $query->where('is_correct', true)->with('challenge');
            }])
            ->get()
            ->map(function (Team $team) {
                return [
                    'team_id' => $team->id,
                    'team_name' => $team->name,
                    'total_score' => $team->total_score,
                    'solved_count' => $team->solved_count,
                    'last_solve_time' => $team->last_solve_time,
                    'member_count' => $team->member_count,
                ];
            })
            ->sortByDesc('total_score')
            ->sortBy(function ($team) {
                // Secondary sort by last solve time (earlier is better)
                return $team['last_solve_time'] ?? '9999-99-99';
            })
            ->values()
            ->map(function ($team, $index) {
                $team['rank'] = $index + 1;
                return $team;
            });
    }

    /**
     * Get a specific team's rank
     */
    public function getTeamRank(int $teamId): int
    {
        $scoreboard = $this->getScoreboard();
        
        $team = $scoreboard->firstWhere('team_id', $teamId);
        
        return $team['rank'] ?? 0;
    }

    /**
     * Clear scoreboard cache (call after score update)
     */
    public function clearCache(): void
    {
        Cache::forget('scoreboard');
    }
}
