<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// CTF Routes (Frontend Only - No Auth)
Route::prefix('ctf')->name('ctf.')->group(function () {
    // Public pages
    Route::get('/', fn () => Inertia::render('ctf/index'))->name('landing');
    Route::get('/login', fn () => Inertia::render('ctf/login'))->name('login');
    Route::get('/scoreboard', fn () => Inertia::render('ctf/scoreboard'))->name('scoreboard');
    
    // Participant pages (normally would have auth middleware)
    Route::get('/challenges', fn () => Inertia::render('ctf/challenges'))->name('challenges');
    Route::get('/team', fn () => Inertia::render('ctf/team'))->name('team');
    
    // Admin pages (normally would have auth + admin middleware)
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('ctf/admin/dashboard'))->name('dashboard');
        Route::get('/users', fn () => Inertia::render('ctf/admin/users/index'))->name('users');
        Route::get('/teams', fn () => Inertia::render('ctf/admin/teams/index'))->name('teams');
        Route::get('/challenges', fn () => Inertia::render('ctf/admin/challenges/index'))->name('challenges');
        Route::get('/submissions', fn () => Inertia::render('ctf/admin/submissions/index'))->name('submissions');
    });
});

require __DIR__.'/settings.php';

