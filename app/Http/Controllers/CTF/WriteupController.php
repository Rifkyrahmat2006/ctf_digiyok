<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Writeup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WriteupController extends Controller
{
    /**
     * Show writeup page for a challenge
     */
    public function show(Request $request, Challenge $challenge): Response
    {
        $user = $request->user();
        $team = $user->team;

        // Get existing writeup or null
        $writeup = Writeup::where('team_id', $team->id)
            ->where('challenge_id', $challenge->id)
            ->first();

        return Inertia::render('ctf/writeup', [
            'challenge' => [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'category' => $challenge->category,
            ],
            'writeup' => $writeup ? [
                'id' => $writeup->id,
                'content' => $writeup->content ?? '',
                'updatedAt' => $writeup->updated_at?->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Upsert writeup for a challenge (auto-save endpoint)
     */
    public function upsert(Request $request, Challenge $challenge): JsonResponse
    {
        $request->validate([
            'content' => 'nullable|string|max:100000',
        ]);

        $user = $request->user();
        $team = $user->team;

        // Upsert: update if exists, create if not
        $writeup = Writeup::updateOrCreate(
            [
                'team_id' => $team->id,
                'challenge_id' => $challenge->id,
            ],
            [
                'content' => $request->content ?? '',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Writeup saved.',
            'updatedAt' => $writeup->updated_at->toIso8601String(),
        ]);
    }
}
