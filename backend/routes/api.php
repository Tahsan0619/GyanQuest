<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConceptLogController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\ResponseController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/progress/sync', [ProgressController::class, 'sync']);
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/responses', [ResponseController::class, 'store']);
    Route::post('/concept-logs', [ConceptLogController::class, 'store']);
});
