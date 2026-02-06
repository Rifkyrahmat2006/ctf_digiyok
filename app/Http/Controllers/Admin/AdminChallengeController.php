<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Services\FlagService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
                'requiresWriteup' => $challenge->requires_writeup,
                'solvedByCount' => $challenge->solved_by_count,
                'flag' => $challenge->flag ?? 'N/A', // Expose raw flag
                'fileUrl' => $challenge->file_url,
                'fileName' => $challenge->file_path ? basename($challenge->file_path) : null,
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
            'requires_writeup' => 'boolean',
            'attachment' => 'nullable|file|max:10240|mimes:zip,rar,7z,tar,gz,txt,pdf,bin,exe,py,c,cpp,java,js',
        ]);

        // Hash flag but keep raw flag for storage
        $validated['flag_hash'] = $this->flagService->hashFlag($validated['flag']);

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $validated['file_path'] = $file->storeAs('challenges', $file->getClientOriginalName(), 'public');
        }

        unset($validated['attachment']); // Remove from validated array before create

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
            'requires_writeup' => 'boolean',
            'attachment' => 'nullable|file|max:10240|mimes:zip,rar,7z,tar,gz,txt,pdf,bin,exe,py,c,cpp,java,js',
            'remove_file' => 'nullable|boolean',
        ]);

        if (!empty($validated['flag'])) {
            $validated['flag_hash'] = $this->flagService->hashFlag($validated['flag']);
        } else {
             unset($validated['flag']);
        }

        // Handle file removal
        if ($request->boolean('remove_file') && $challenge->file_path) {
            Storage::disk('public')->delete($challenge->file_path);
            $validated['file_path'] = null;
        }

        // Handle file upload (replaces existing)
        if ($request->hasFile('attachment')) {
            // Delete old file if exists
            if ($challenge->file_path) {
                Storage::disk('public')->delete($challenge->file_path);
            }
            $file = $request->file('attachment');
            $validated['file_path'] = $file->storeAs('challenges', $file->getClientOriginalName(), 'public');
        }

        unset($validated['attachment'], $validated['remove_file']);

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
        // Delete associated file
        if ($challenge->file_path) {
            Storage::disk('public')->delete($challenge->file_path);
        }

        $challenge->delete();

        return redirect()->back()->with('success', 'Challenge deleted successfully.');
    }
}
