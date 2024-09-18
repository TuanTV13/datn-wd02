<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [LoginController::class, 'login'])->name('login')->middleware('verify.email');


Route::get('/get-districts/{provinceId}', [RegisterController::class, 'getDistricts']);
Route::get('/get-wards/{districtId}', [RegisterController::class, 'getWards']);
Route::get('/get-provinces', [RegisterController::class, 'showProvinces']);
Route::post('register', [RegisterController::class, 'register'])->name('register');
Route::get('email/verify/{token}', [VerificationController::class, 'verify'])->name('verification.verify');
