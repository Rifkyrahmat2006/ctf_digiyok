<?php

namespace App\Services;

use App\Models\Event;
use Carbon\Carbon;

class EventService
{
    /**
     * Get the currently active event
     */
    public function getActiveEvent(): ?Event
    {
        return Event::getActive();
    }

    /**
     * Get countdown data for polling endpoint
     */
    public function getCountdownData(): array
    {
        $event = $this->getActiveEvent();

        if (!$event) {
            return [
                'hasEvent' => false,
                'server_time' => Carbon::now()->toIso8601String(),
                'start_time' => null,
                'end_time' => null,
                'remaining_seconds' => 0,
                'seconds_until_start' => 0,
                'status' => 'no_event',
                'event_name' => null,
            ];
        }

        return [
            'hasEvent' => true,
            'server_time' => Carbon::now()->toIso8601String(),
            'start_time' => $event->start_time->toIso8601String(),
            'end_time' => $event->end_time->toIso8601String(),
            'remaining_seconds' => $event->remaining_seconds,
            'seconds_until_start' => $event->seconds_until_start,
            'status' => $event->status,
            'event_name' => $event->name,
        ];
    }

    /**
     * Check if the event is currently running (for submission validation)
     */
    public function isEventRunning(): bool
    {
        $event = $this->getActiveEvent();

        if (!$event) {
            // No event configured - allow submissions (admin should configure)
            return true;
        }

        return $event->status === 'running';
    }

    /**
     * Check if event has ended
     */
    public function hasEventEnded(): bool
    {
        $event = $this->getActiveEvent();

        if (!$event) {
            return false;
        }

        return $event->status === 'ended';
    }
}
