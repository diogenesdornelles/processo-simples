<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProcsController;
use App\Http\Controllers\EventsController;

Route::apiResource('users', UsersController::class);
Route::apiResource('procs', ProcsController::class);
Route::apiResource('events', EventsController::class);