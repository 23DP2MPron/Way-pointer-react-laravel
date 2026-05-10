<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\RouteController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/places',                [PlaceController::class,       'index']);
Route::get('/places/{place}',        [PlaceController::class,       'show']);
Route::get('/institutions',          [InstitutionController::class, 'index']);
Route::get('/institutions/{institution}', [InstitutionController::class, 'show']);
Route::get('/routes',                [RouteController::class,       'index']);
Route::get('/routes/{route}',        [RouteController::class,       'show']);
Route::get('/routes/{route}/reviews', [RouteController::class,      'getReviews']);
Route::get('/reviews',               [ReviewController::class,      'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',           [AuthController::class,    'logout']);
    Route::get('/me',                [AuthController::class,    'me']);
    Route::post('/me',               [AuthController::class,    'updateProfile']);

    Route::get('/my-routes',         [RouteController::class,   'myRoutes']);
    Route::post('/routes',           [RouteController::class,   'store']);
    Route::put('/routes/{route}',    [RouteController::class,   'update']);
    Route::delete('/routes/{route}', [RouteController::class,   'destroy']);
    Route::post('/routes/{route}/reviews', [RouteController::class, 'addReview']);

    Route::post('/reviews',          [ReviewController::class,  'store']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    Route::get('/favorites',         [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/favorites/check',   [FavoriteController::class, 'check']);

    // Admin only
    Route::middleware('admin')->group(function () {
        Route::apiResource('/places',       PlaceController::class)->except(['index', 'show']);
        Route::apiResource('/institutions', InstitutionController::class)->except(['index', 'show']);
        Route::get('/users',               [UserController::class, 'index']);
        Route::get('/users/{user}',        [UserController::class, 'show']);
        Route::put('/users/{user}',        [UserController::class, 'update']);
        Route::delete('/users/{user}',     [UserController::class, 'destroy']);
    });
});
Route::get('/places/top', function () {
    // Получаем места с рейтингом >= 4, сортируем по убыванию
    return \App\Models\Place::where('rating', '>=', 4)
        ->orderBy('rating', 'desc')
        ->limit(10)
        ->get();
});

Route::get('/top-places', function() {
    return \App\Models\Place::orderBy('rating', 'desc')->limit(6)->get();
});

Route::get('/places/random', [PlaceController::class, 'getRandomPlaces']);