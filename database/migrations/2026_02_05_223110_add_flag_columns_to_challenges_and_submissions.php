<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->text('flag')->nullable()->after('score');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->text('submitted_flag')->nullable()->after('challenge_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->dropColumn('flag');
        });

        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn('submitted_flag');
        });
    }
};
