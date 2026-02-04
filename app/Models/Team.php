<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
    ];

    /**
     * Get all users in this team
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get all submissions by this team
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Get total score for this team
     */
    public function getTotalScoreAttribute(): int
    {
        return $this->submissions()
            ->where('is_correct', true)
            ->with('challenge')
            ->get()
            ->sum(fn($sub) => $sub->challenge->score ?? 0);
    }

    /**
     * Get count of solved challenges
     */
    public function getSolvedCountAttribute(): int
    {
        return $this->submissions()
            ->where('is_correct', true)
            ->distinct('challenge_id')
            ->count('challenge_id');
    }

    /**
     * Get last solve time
     */
    public function getLastSolveTimeAttribute(): ?string
    {
        $lastSubmission = $this->submissions()
            ->where('is_correct', true)
            ->latest()
            ->first();

        return $lastSubmission?->created_at?->toIso8601String();
    }

    /**
     * Get member count
     */
    public function getMemberCountAttribute(): int
    {
        return $this->users()->count();
    }
}
