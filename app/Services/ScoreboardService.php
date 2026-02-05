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
                    'teamId' => $team->id,
                    'teamName' => $team->name,
                    'totalScore' => $team->total_score,
                    'solvedCount' => $team->solved_count,
                    'lastSolveTime' => $team->last_solve_time,
                    'memberCount' => $team->member_count,
                ];
            })
            ->sortByDesc('totalScore')
            ->sortBy(function ($team) {
                // Secondary sort by last solve time (earlier is better)
                return $team['lastSolveTime'] ?? '9999-99-99';
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
        
        $team = $scoreboard->firstWhere('teamId', $teamId);
        
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
