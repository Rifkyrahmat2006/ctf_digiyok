<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Team;
use App\Services\ScoreboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function __construct(
        protected ScoreboardService $scoreboardService
    ) {}
    
    public function show(Request $request): Response
    {
        $user = $request->user();
        $team = $user->team;
        
        // Load relationships
        $team->load(['users', 'submissions.challenge']);
        
        $solvedChallenges = $team->submissions
            ->where('is_correct', true)
            ->map(fn ($sub) => [
                'id' => $sub->challenge->id,
                'title' => $sub->challenge->title,
                'category' => $sub->challenge->category,
                'score' => $sub->challenge->score,
                'solvedAt' => $sub->created_at->toIso8601String(),
            ])
            ->values();

        // Get rank
        $rank = $this->scoreboardService->getTeamRank($team->id);

        $teamData = [
            'id' => $team->id,
            'name' => $team->name,
            'code' => $team->code,
            'memberCount' => $team->member_count,
            'solvedCount' => $team->solved_count,
            'score' => $team->total_score,
            'rank' => $rank,
        ];

        return Inertia::render('ctf/team', [
            'team' => $teamData,
            'members' => $team->users->map(fn($u) => [
                'name' => $u->name,
                'username' => $u->username,
                'role' => $u->role
            ]),
            'solvedChallenges' => $solvedChallenges,
        ]);
    }
}
