<?php

namespace App\Http\Controllers\CTF;

use App\Http\Controllers\Controller;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    /**
     * Lightweight countdown endpoint for polling
     */
    public function countdown(): JsonResponse
    {
        return response()->json($this->eventService->getCountdownData());
    }
}
