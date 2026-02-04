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
        Schema::table('users', function (Blueprint $table) {
            // Add username field after id
            $table->string('username')->unique()->after('id');
            
            // Add role field
            $table->enum('role', ['admin', 'participant'])->default('participant')->after('password');
            
            // Add team_id foreign key (nullable for admins)
            $table->foreignId('team_id')->nullable()->after('role')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropColumn(['username', 'role', 'team_id']);
        });
    }
};
