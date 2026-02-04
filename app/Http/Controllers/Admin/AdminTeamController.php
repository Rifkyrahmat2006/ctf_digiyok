<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminTeamController extends Controller
{
    public function index(): Response
    {
        $teams = Team::withCount(['users', 'submissions']) // simple submissions count
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'code' => $team->code,
                    'memberCount' => $team->users_count, // using withCount attribute
                    'totalScore' => $team->total_score, // computed attribute
                    'solvedCount' => $team->solved_count, // computed attribute
                ];
            });

        return Inertia::render('ctf/admin/teams/index', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:teams',
            'code' => 'nullable|string|max:255|unique:teams',
        ]);

        Team::create($validated);

        return redirect()->back()->with('success', 'Team created successfully.');
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('teams')->ignore($team->id)],
            'code' => ['nullable', 'string', 'max:255', Rule::unique('teams')->ignore($team->id)],
        ]);

        $team->update($validated);

        return redirect()->back()->with('success', 'Team updated successfully.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $team->delete();

        return redirect()->back()->with('success', 'Team deleted successfully.');
    }
}
