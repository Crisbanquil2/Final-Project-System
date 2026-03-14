<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Needed by Laravel's password reset email to generate a reset link.
// For SPA apps, you can later replace this with a redirect to your frontend reset page.
Route::get('/reset-password/{token}', function (string $token) {
    return response()->json([
        'message' => 'Password reset endpoint placeholder for SPA.',
        'token' => $token,
        'email' => request('email'),
    ]);
})->name('password.reset');
