<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
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


Route::post('register', [RegisterController::class, 'register'])->name('register');
Route::get('email/verify/{token}', [VerificationController::class, 'verify'])->name('verification.verify');
Route::post('send-code', [ForgotPasswordController::class, 'sendCode'])->name('sendCode');
Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('resetPassword');

Route::prefix('v1')->middleware('verify.email')->group(function () {

    Route::get('/get-districts/{provinceId}', [RegisterController::class, 'getDistricts'])->name('getDistricts');
    Route::get('/get-wards/{districtId}', [RegisterController::class, 'getWards'])->name('getWards');
    Route::get('/get-provinces', [RegisterController::class, 'showProvinces'])->name('showProvinces');

    Route::post('login', [LoginController::class, 'login'])->name('login');
    Route::post('refresh', [LoginController::class, 'refresh'])->name('refresh.token');

});

Route::post('query', [UserController::class, 'query']);