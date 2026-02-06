<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'is_active',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the active event
     */
    public static function getActive(): ?self
    {
        return static::where('is_active', true)->first();
    }

    /**
     * Get event status: scheduled, running, or ended
     */
    public function getStatusAttribute(): string
    {
        $now = Carbon::now();

        if ($now->lt($this->start_time)) {
            return 'scheduled';
        }

        if ($now->gte($this->start_time) && $now->lt($this->end_time)) {
            return 'running';
        }

        return 'ended';
    }

    /**
     * Get remaining seconds until event ends
     */
    public function getRemainingSecondsAttribute(): int
    {
        $now = Carbon::now();

        if ($now->lt($this->start_time)) {
            // Event hasn't started - return seconds until start
            return max(0, $now->diffInSeconds($this->start_time, false));
        }

        if ($now->gte($this->end_time)) {
            return 0;
        }

        return max(0, $now->diffInSeconds($this->end_time, false));
    }

    /**
     * Get seconds until event starts
     */
    public function getSecondsUntilStartAttribute(): int
    {
        $now = Carbon::now();

        if ($now->gte($this->start_time)) {
            return 0;
        }

        return max(0, $now->diffInSeconds($this->start_time, false));
    }
}
