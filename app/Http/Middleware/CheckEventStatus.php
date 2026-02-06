<?php

namespace App\Http\Middleware;

use App\Services\EventService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEventStatus
{
    public function __construct(
        protected EventService $eventService
    ) {}

    /**
     * Handle an incoming request.
     * Redirect to waiting room if event hasn't started yet.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $countdownData = $this->eventService->getCountdownData();

        // If no active event or event is running, allow access
        if (!$countdownData['hasEvent'] || $countdownData['status'] === 'running') {
            return $next($request);
        }

        // If event is scheduled (not started) or ended, redirect to waiting room
        return redirect()->route('ctf.waiting');
    }
}
