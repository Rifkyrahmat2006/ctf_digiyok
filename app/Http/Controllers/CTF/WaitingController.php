<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Inertia\Inertia;
use Inertia\Response;

class WaitingController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    public function index(): Response
    {
        $countdownData = $this->eventService->getCountdownData();

        // If event is running, redirect to challenges
        if ($countdownData['hasEvent'] && $countdownData['status'] === 'running') {
            return Inertia::location(route('ctf.challenges'));
        }

        return Inertia::render('ctf/waiting', [
            'countdownData' => $countdownData,
        ]);
    }
}
