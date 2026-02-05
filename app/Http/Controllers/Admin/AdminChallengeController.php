<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Services\FlagService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminChallengeController extends Controller
{
    public function __construct(
        protected FlagService $flagService
    ) {}

    public function index(): Response
    {
        $challenges = Challenge::orderBy('category')
            ->orderBy('id')
            ->get()
            ->map(fn ($challenge) => [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'description' => $challenge->description,
                'category' => $challenge->category,
                'score' => $challenge->score,
                'isPublished' => $challenge->is_published,
                'solves' => $challenge->solved_by_count,
                'flag' => $challenge->flag ?? 'N/A', // Expose raw flag
            ]);

        return Inertia::render('ctf/admin/challenges/index', [
            'challenges' => $challenges,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:' . implode(',', Challenge::CATEGORIES),
            'score' => 'required|integer|min:0',
            'flag' => 'required|string', // Raw flag input
            'dependency_id' => 'nullable|exists:challenges,id',
            'is_published' => 'boolean',
        ]);

        // Hash flag but keep raw flag for storage
        $validated['flag_hash'] = $this->flagService->hashFlag($validated['flag']);
        // $validated['flag'] is already there, don't unset it

        Challenge::create($validated);

        return redirect()->back()->with('success', 'Challenge created successfully.');
    }

    public function update(Request $request, Challenge $challenge): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:' . implode(',', Challenge::CATEGORIES),
            'score' => 'required|integer|min:0',
            'flag' => 'nullable|string', // Optional if updating other fields
            'dependency_id' => 'nullable|exists:challenges,id',
            'is_published' => 'boolean',
        ]);

        if (!empty($validated['flag'])) {
            $validated['flag_hash'] = $this->flagService->hashFlag($validated['flag']);
            // Keep $validated['flag'] to update raw flag
        } else {
             unset($validated['flag']); // Don't wipe existing flag if empty input
        }

        $challenge->update($validated);

        return redirect()->back()->with('success', 'Challenge updated successfully.');
    }

    public function togglePublish(Challenge $challenge): RedirectResponse
    {
        $challenge->update([
            'is_published' => !$challenge->is_published,
        ]);

        return redirect()->back()->with('success', 'Challenge status updated.');
    }

    public function destroy(Challenge $challenge): RedirectResponse
    {
        $challenge->delete();

        return redirect()->back()->with('success', 'Challenge deleted successfully.');
    }
}
