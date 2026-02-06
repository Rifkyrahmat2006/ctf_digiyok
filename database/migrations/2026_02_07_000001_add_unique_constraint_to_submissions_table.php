<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Adds a unique constraint to prevent duplicate correct submissions
     * for the same team+challenge combination (race condition fix).
     */
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            // Add nullable column that will hold unique key only for correct submissions
            $table->string('correct_submission_key')->nullable()->after('is_correct');
            
            // Add unique index on this column
            $table->unique('correct_submission_key', 'submissions_correct_unique');
        });

        // Populate existing correct submissions with the key
        DB::statement("
            UPDATE submissions 
            SET correct_submission_key = CONCAT(team_id, '_', challenge_id) 
            WHERE is_correct = 1
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropUnique('submissions_correct_unique');
            $table->dropColumn('correct_submission_key');
        });
    }
};
