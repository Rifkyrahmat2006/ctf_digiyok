<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChallengeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $team = $user->team;

        // Eager load dependencies to check locking
        $challenges = Challenge::published()
            ->with(['dependency', 'submissions' => function ($query) use ($team) {
                // To check if solved
                $query->where('team_id', $team->id)->where('is_correct', true);
            }])
            ->get()
            ->map(function ($challenge) use ($team) {
                $isSolved = $challenge->submissions->isNotEmpty();
                $isLocked = $challenge->isLockedForTeam($team->id);

                return [
                    'id' => $challenge->id,
                    'title' => $challenge->title,
                    'description' => $challenge->description,
                    'category' => $challenge->category,
                    'score' => $challenge->score,
                    'isSolved' => $isSolved,
                    'isLocked' => $isLocked,
                    'solvedByCount' => $challenge->solved_by_count,
                    'fileUrl' => $challenge->file_url,
                    'fileName' => $challenge->file_path ? basename($challenge->file_path) : null,
                ];
            });

        return Inertia::render('ctf/challenges', [
            'challenges' => $challenges,
        ]);
    }
}
