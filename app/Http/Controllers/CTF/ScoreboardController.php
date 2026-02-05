<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Services\ScoreboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScoreboardController extends Controller
{
    public function __construct(
        protected ScoreboardService $scoreboardService
    ) {}

    public function index(Request $request): Response
    {
        $scoreboard = $this->scoreboardService->getScoreboard();

        return Inertia::render('ctf/scoreboard', [
            'initialScoreboard' => $scoreboard,
            'websocketUrl' => config('services.websocket.public_url'),
        ]);
    }
}
