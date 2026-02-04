<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
use App\Models\Team;
use App\Models\User;
use App\Services\ScoreboardService;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __construct(
        protected ScoreboardService $scoreboardService
    ) {}

    public function index(): Response
    {
        // Get scoreboard for stats and top teams
        $scoreboard = $this->scoreboardService->getScoreboard();

        $stats = [
            'totalTeams' => Team::count(),
            'totalUsers' => User::where('role', 'participant')->count(),
            'totalChallenges' => Challenge::count(),
            'totalSubmissions' => Submission::count(),
            // Added missing stats
            'correctSubmissions' => Submission::where('is_correct', true)->count(),
            'publishedChallenges' => Challenge::where('is_published', true)->count(),
            'averageScore' => round($scoreboard->avg('total_score') ?? 0),
        ];

        // Get recent submissions
        $recentSubmissions = Submission::with(['team', 'challenge', 'user'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($sub) => [
                'id' => $sub->id,
                'teamName' => $sub->team->name,
                'challengeTitle' => $sub->challenge->title, // Changed key to match frontend
                'isCorrect' => $sub->is_correct,
                'createdAt' => $sub->created_at->toIso8601String(), // Changed key to match frontend dayjs usage
            ]);

        // Get top teams from service and convert to camelCase
        $topTeams = $scoreboard->take(5)->map(fn($team) => [
            'teamId' => $team['team_id'],
            'teamName' => $team['team_name'],
            'totalScore' => $team['total_score'],
            'solvedCount' => $team['solved_count'],
            'lastSolveTime' => $team['last_solve_time'],
            'rank' => $team['rank'],
        ]);

        return Inertia::render('ctf/admin/dashboard', [
            'stats' => $stats,
            'recentSubmissions' => $recentSubmissions,
            'topTeams' => $topTeams,
        ]);
    }
}
