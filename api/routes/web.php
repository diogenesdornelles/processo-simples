<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProcsController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\AccessController;

Route::prefix('api')->group(function () {
    Route::post('/login', [AccessController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AccessController::class, 'logout']);
        Route::get('/me', [AccessController::class, 'me']);
        Route::apiResource('users', UsersController::class);
        Route::apiResource('procs', ProcsController::class);
        Route::apiResource('events', EventsController::class);
        Route::apiResource('docs', DocsController::class);
    });
});