<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UploadController;

// 🔐 AUTH
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// 📌 PROFILE (single)
Route::get('/profile', [ProfileController::class, 'index']);
Route::post('/profile', [ProfileController::class, 'store']);
Route::put('/profile/{id}', [ProfileController::class, 'update']);
Route::delete('/profile', [ProfileController::class, 'destroy']);

// 📌 CRUD
Route::apiResource('skills', SkillController::class);
Route::apiResource('projects', ProjectController::class);
Route::apiResource('experiences', ExperienceController::class);
Route::apiResource('education', EducationController::class);
Route::apiResource('certificates', CertificateController::class);

// 📌 CONTACT
Route::get('/contact-messages', [ContactController::class, 'index']);
Route::delete('/contact-messages/{id}', [ContactController::class, 'destroy']);
Route::post('/contact', [ContactController::class, 'store']);

// 📌 SAVE
Route::post('/upload', [UploadController::class, 'store']);