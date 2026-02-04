<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;

class FlagService
{
    /**
     * Hash a flag for storage
     * Uses SHA256 for consistent comparison
     */
    public function hashFlag(string $flag): string
    {
        // Trim whitespace but preserve case (case-sensitive)
        $flag = trim($flag);
        
        return hash('sha256', $flag);
    }

    /**
     * Verify a submitted flag against stored hash
     */
    public function verifyFlag(string $submittedFlag, string $storedHash): bool
    {
        $submittedHash = $this->hashFlag($submittedFlag);
        
        return hash_equals($storedHash, $submittedHash);
    }

    /**
     * Check if flag format is valid
     */
    public function isValidFormat(string $flag): bool
    {
        // Basic validation - flag should not be empty
        return strlen(trim($flag)) > 0;
    }
}
