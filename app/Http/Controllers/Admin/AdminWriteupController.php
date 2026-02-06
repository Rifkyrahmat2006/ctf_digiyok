<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Writeup;
use Inertia\Inertia;
use Inertia\Response;

class AdminWriteupController extends Controller
{
    /**
     * List all writeups grouped by challenge
     */
    public function index(): Response
    {
        $writeups = Writeup::with(['team', 'challenge'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn ($writeup) => [
                'id' => $writeup->id,
                'teamId' => $writeup->team_id,
                'teamName' => $writeup->team->name,
                'challengeId' => $writeup->challenge_id,
                'challengeTitle' => $writeup->challenge->title,
                'challengeCategory' => $writeup->challenge->category,
                'content' => $writeup->content,
                'contentPreview' => mb_substr($writeup->content ?? '', 0, 150) . (mb_strlen($writeup->content ?? '') > 150 ? '...' : ''),
                'updatedAt' => $writeup->updated_at->toIso8601String(),
            ]);

        $challenges = Challenge::orderBy('category')
            ->orderBy('title')
            ->get(['id', 'title', 'category']);

        return Inertia::render('ctf/admin/writeups/index', [
            'writeups' => $writeups,
            'challenges' => $challenges,
        ]);
    }

    /**
     * View a specific writeup
     */
    public function show(Writeup $writeup): Response
    {
        $writeup->load(['team', 'challenge']);

        return Inertia::render('ctf/admin/writeups/show', [
            'writeup' => [
                'id' => $writeup->id,
                'teamName' => $writeup->team->name,
                'challengeTitle' => $writeup->challenge->title,
                'challengeCategory' => $writeup->challenge->category,
                'content' => $writeup->content,
                'updatedAt' => $writeup->updated_at->toIso8601String(),
            ],
        ]);
    }
}
