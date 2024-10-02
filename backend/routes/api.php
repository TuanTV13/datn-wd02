<?php

use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\TicketController;
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

// Middleware để lấy thông tin người dùng đã xác thực
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Nhóm các route liên quan đến xác thực
Route::prefix('auth')->group(function () {
    Route::post('register', [RegisterController::class, 'register'])->name('register');
    Route::get('email/verify/{token}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::post('send-code', [ForgotPasswordController::class, 'sendCode'])->name('sendCode');
    Route::post('reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('resetPassword');
    Route::post('refresh', [LoginController::class, 'refresh'])->name('refresh.token');

    Route::prefix('v1')->middleware('verify.email')->group(function () {
        Route::post('login', [LoginController::class, 'login'])->name('login');
    });
});

// Nhóm các route liên quan đến vị trí
Route::prefix('locations')->group(function () {
    Route::get('/get-provinces', [RegisterController::class, 'showProvinces'])->name('showProvinces');
    Route::get('/get-districts/{provinceId}', [RegisterController::class, 'getDistricts'])->name('getDistricts');
    Route::get('/get-wards/{districtId}', [RegisterController::class, 'getWards'])->name('getWards');
});

// Nhóm các route liên quan đến sự kiện và thêm middleware kiểm tra xác thực
Route::prefix('events')->middleware('check.jwt')->group(function () {
    Route::get('/', [EventController::class, 'index'])->name('events.index');
    Route::post('/create', [EventController::class, 'store'])->name('events.store');
    Route::get('/{id}', [EventController::class, 'show'])->name('events.show');
    Route::post('/destroy/{id}', [EventController::class, 'destroy'])->name('events.destroy');
    Route::put('/{id}', [EventController::class, 'update'])->name('events.update'); // Sử dụng PUT cho cập nhật
});

// Nhóm các route liên quan đến vé và thêm middleware kiểm tra xác thực
Route::prefix('tickets')->middleware('check.jwt')->group(function () {
    Route::get('/', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('/store', [TicketController::class, 'store'])->name('tickets.store');
});
