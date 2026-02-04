<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Inertia\Inertia;
use Inertia\Response;

class AdminSubmissionController extends Controller
{
    public function index(): Response
    {
        $submissions = Submission::with(['team', 'challenge', 'user'])
            ->latest()
            ->paginate(50)
            ->through(fn ($sub) => [
                'id' => $sub->id,
                'teamName' => $sub->team->name,
                'teamId' => $sub->team_id,
                'challengeName' => $sub->challenge->title,
                'userName' => $sub->user->username,
                'submittedFlag' => 'HIDDEN', // Don't show submitted flags for security in logs if hash is stored
                'isCorrect' => $sub->is_correct,
                'timestamp' => $sub->created_at->toIso8601String(),
            ]);

        $stats = [
            'total' => Submission::count(),
            'correct' => Submission::where('is_correct', true)->count(),
            'incorrect' => Submission::where('is_correct', false)->count(),
        ];

        return Inertia::render('ctf/admin/submissions/index', [
            'submissions' => $submissions,
            'stats' => $stats,
        ]);
    }
}
