<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminEventController extends Controller
{
    public function index(): Response
    {
        $events = Event::orderBy('created_at', 'desc')->get()->map(fn ($event) => [
            'id' => $event->id,
            'name' => $event->name,
            'startTime' => $event->start_time->toIso8601String(),
            'endTime' => $event->end_time->toIso8601String(),
            'isActive' => $event->is_active,
            'status' => $event->status,
        ]);

        $activeEvent = Event::getActive();

        return Inertia::render('ctf/admin/events/index', [
            'events' => $events,
            'activeEventId' => $activeEvent?->id,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        Event::create($validated);

        return redirect()->back()->with('success', 'Event created successfully.');
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully.');
    }

    public function activate(Event $event): RedirectResponse
    {
        // Deactivate all events first
        Event::where('is_active', true)->update(['is_active' => false]);

        // Activate the selected event
        $event->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Event activated successfully.');
    }

    public function deactivate(Event $event): RedirectResponse
    {
        $event->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Event deactivated successfully.');
    }
}
