<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Team;
use App\Services\SubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function __construct(
        protected SubmissionService $submissionService
    ) {}

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'challenge_id' => 'required|exists:challenges,id',
            'flag' => 'required|string',
        ]);

        $user = $request->user();
        $team = $user->team;
        $challenge = Challenge::findOrFail($request->challenge_id);

        $result = $this->submissionService->submit($team, $challenge, $request->flag, $user);

        return response()->json($result);
    }
}
