<?php

namespace App\Services;

use App\Events\ScoreboardUpdated;
use App\Models\Challenge;
use App\Models\Submission;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

class SubmissionService
{
    public function __construct(
        protected FlagService $flagService,
        protected ScoreboardService $scoreboardService
    ) {}

    /**
     * Submit a flag for a challenge
     * 
     * @return array{success: bool, message: string, submission?: Submission}
     */
    public function submit(Team $team, Challenge $challenge, string $flag, User $user): array
    {
        // Check rate limit (1 submission per 3 seconds per team)
        $rateLimitKey = "submission:{$team->id}";
        
        if (RateLimiter::tooManyAttempts($rateLimitKey, 1)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return [
                'success' => false,
                'message' => "Rate limited. Please wait {$seconds} seconds.",
            ];
        }
        
        RateLimiter::hit($rateLimitKey, 3); // 3 seconds decay

        // Check if challenge is published
        if (!$challenge->is_published) {
            return [
                'success' => false,
                'message' => 'Challenge is not available.',
            ];
        }

        // Check if challenge is locked (dependency not solved)
        if ($challenge->isLockedForTeam($team->id)) {
            return [
                'success' => false,
                'message' => 'You must solve the prerequisite challenge first.',
            ];
        }

        // Check if team already solved this challenge
        $alreadySolved = Submission::where('team_id', $team->id)
            ->where('challenge_id', $challenge->id)
            ->where('is_correct', true)
            ->exists();

        if ($alreadySolved) {
            return [
                'success' => false,
                'message' => 'Your team has already solved this challenge.',
            ];
        }

        // Validate flag format
        if (!$this->flagService->isValidFormat($flag)) {
            return [
                'success' => false,
                'message' => 'Invalid flag format.',
            ];
        }

        // Check if flag is correct
        $isCorrect = $this->flagService->verifyFlag($flag, $challenge->flag_hash);

        // Create submission record
        $submission = Submission::create([
            'team_id' => $team->id,
            'challenge_id' => $challenge->id,
            'user_id' => $user->id,
            'submitted_flag_hash' => $this->flagService->hashFlag($flag),
            'is_correct' => $isCorrect,
        ]);

        if ($isCorrect) {
            // Broadcast scoreboard update
            $this->broadcastScoreboardUpdate();

            return [
                'success' => true,
                'message' => 'Correct! You earned ' . $challenge->score . ' points.',
                'submission' => $submission,
            ];
        }

        return [
            'success' => false,
            'message' => 'Incorrect flag. Try again!',
            'submission' => $submission,
        ];
    }

    /**
     * Broadcast scoreboard update event
     */
    protected function broadcastScoreboardUpdate(): void
    {
        $scoreboard = $this->scoreboardService->getScoreboard();
        
        broadcast(new ScoreboardUpdated($scoreboard->toArray()))->toOthers();
    }
}
