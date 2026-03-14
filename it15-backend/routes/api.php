<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SchoolDayController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/enrollment', [DashboardController::class, 'enrollment']);
    Route::get('/dashboard/courses',    [DashboardController::class, 'courses']);
    Route::get('/dashboard/attendance', [DashboardController::class, 'attendance']);
    Route::get('/summary',              [DashboardController::class, 'summary']);

    Route::get('/programs', [CourseController::class, 'index']);
    Route::post('/programs', [CourseController::class, 'store']);

    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/school-days', [SchoolDayController::class, 'index']);
});

