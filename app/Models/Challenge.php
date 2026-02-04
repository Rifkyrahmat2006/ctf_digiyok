<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'score',
        'flag_hash',
        'dependency_id',
        'is_published',
    ];

    protected $casts = [
        'score' => 'integer',
        'is_published' => 'boolean',
    ];

    /**
     * Challenge categories
     */
    public const CATEGORIES = ['Web', 'Crypto', 'Forensic', 'Reverse', 'Misc'];

    /**
     * Get dependency challenge (if any)
     */
    public function dependency(): BelongsTo
    {
        return $this->belongsTo(Challenge::class, 'dependency_id');
    }

    /**
     * Get challenges that depend on this one
     */
    public function dependents(): HasMany
    {
        return $this->hasMany(Challenge::class, 'dependency_id');
    }

    /**
     * Get all submissions for this challenge
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Get count of teams that solved this challenge
     */
    public function getSolvedByCountAttribute(): int
    {
        return $this->submissions()
            ->where('is_correct', true)
            ->distinct('team_id')
            ->count('team_id');
    }

    /**
     * Check if a team has solved this challenge
     */
    public function isSolvedByTeam(?int $teamId): bool
    {
        if (!$teamId) return false;
        
        return $this->submissions()
            ->where('team_id', $teamId)
            ->where('is_correct', true)
            ->exists();
    }

    /**
     * Check if challenge is locked for a team (dependency not solved)
     */
    public function isLockedForTeam(?int $teamId): bool
    {
        if (!$this->dependency_id) return false;
        if (!$teamId) return true;

        return !$this->dependency->isSolvedByTeam($teamId);
    }

    /**
     * Scope for published challenges
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
