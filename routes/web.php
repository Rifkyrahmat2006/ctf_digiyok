<?php

use App\Http\Controllers\Admin\AdminChallengeController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminSubmissionController;
use App\Http\Controllers\Admin\AdminTeamController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CTF\ChallengeController;
use App\Http\Controllers\CTF\EventController;
use App\Http\Controllers\CTF\ScoreboardController;
use App\Http\Controllers\CTF\SubmissionController;
use App\Http\Controllers\CTF\TeamController;
use App\Http\Controllers\CTF\WaitingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page
Route::get('/', function () {
    return redirect()->route('ctf.landing');
});

// CTF Routes
Route::prefix('ctf')->name('ctf.')->group(function () {
    // Public pages
    Route::get('/', fn () => Inertia::render('ctf/index'))->name('landing');
    Route::get('/login', fn () => Inertia::render('ctf/login'))->name('login');
    
    // Public countdown endpoint (for polling)
    Route::get('/event/countdown', [EventController::class, 'countdown'])->name('event.countdown');
    
    // Waiting room (accessible to logged-in participants)
    Route::middleware(['auth', 'verified', 'participant'])
        ->get('/waiting', [WaitingController::class, 'index'])->name('waiting');
    
    // Auth Routes will be handled by Fortify, but we might alias /ctf/login to /login if needed
    // Fortify default login route is /login
    
    // Participant pages (Auth + Participant + Event Check)
    Route::middleware(['auth', 'verified', 'participant', 'event.check'])->group(function () {
        Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges');
        Route::post('/submissions', [SubmissionController::class, 'store'])->name('submissions.store');
        Route::get('/scoreboard', [ScoreboardController::class, 'index'])->name('scoreboard');
        Route::get('/team', [TeamController::class, 'show'])->name('team');
    });
    
    // Admin pages (Auth + Admin)
    Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Users
        Route::get('/users', [AdminUserController::class, 'index'])->name('users');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('users.reset-password');
        
        // Teams
        Route::get('/teams', [AdminTeamController::class, 'index'])->name('teams');
        Route::post('/teams', [AdminTeamController::class, 'store'])->name('teams.store');
        Route::put('/teams/{team}', [AdminTeamController::class, 'update'])->name('teams.update');
        Route::delete('/teams/{team}', [AdminTeamController::class, 'destroy'])->name('teams.destroy');
        
        // Challenges
        Route::get('/challenges', [AdminChallengeController::class, 'index'])->name('challenges');
        Route::post('/challenges', [AdminChallengeController::class, 'store'])->name('challenges.store');
        Route::put('/challenges/{challenge}', [AdminChallengeController::class, 'update'])->name('challenges.update');
        Route::delete('/challenges/{challenge}', [AdminChallengeController::class, 'destroy'])->name('challenges.destroy');
        Route::post('/challenges/{challenge}/toggle-publish', [AdminChallengeController::class, 'togglePublish'])->name('challenges.toggle-publish');
        
        // Submissions
        Route::get('/submissions', [AdminSubmissionController::class, 'index'])->name('submissions');
        
        // Events
        Route::get('/events', [AdminEventController::class, 'index'])->name('events');
        Route::post('/events', [AdminEventController::class, 'store'])->name('events.store');
        Route::put('/events/{event}', [AdminEventController::class, 'update'])->name('events.update');
        Route::delete('/events/{event}', [AdminEventController::class, 'destroy'])->name('events.destroy');
        Route::post('/events/{event}/activate', [AdminEventController::class, 'activate'])->name('events.activate');
        Route::post('/events/{event}/deactivate', [AdminEventController::class, 'deactivate'])->name('events.deactivate');
    });
});
