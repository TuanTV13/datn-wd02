<?php

use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\TicketController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Admin\RoleController;
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

// Route vị trí
Route::prefix('locations')->group(function () {
    Route::get('/get-provinces', [RegisterController::class, 'showProvinces'])->name('showProvinces');
    Route::get('/get-districts/{provinceId}', [RegisterController::class, 'getDistricts'])->name('getDistricts');
    Route::get('/get-wards/{districtId}', [RegisterController::class, 'getWards'])->name('getWards');
});

// Route về sự kiện
Route::prefix('events')->middleware(['check.jwt', 'check.permission:manage-events'])->group(function () {

    Route::post('/create', [EventController::class, 'store'])->name('event.create');
});

// Route về vé
Route::prefix('tickets')->middleware(['check.jwt', 'check.permission:manage-tickets'])->group(function () {});


// Route quản lý người dùng
Route::prefix('users')->middleware(['check.jwt', 'check.permission:manage-users'])->group(function () {

    Route::post('/create', [UserController::class, 'create'])
        ->name('user.create');

    Route::put('/update/{id}', [UserController::class, 'update'])
        ->name('user.update');

    Route::delete('/destroy/{id}', [UserController::class, 'destroy'])
        ->name('user.destroy');

    Route::get('/{id}', [UserController::class, 'show'])->name('user.show');
});


// Phân quyền admin
Route::prefix('role')->middleware(['check.jwt'])->group(function () {

    Route::get('/{id}/permissions', [RoleController::class, 'getPermissionsByRole'])->name('get.permission.to.role');

    Route::get('/{id}', [RoleController::class, 'assignAdminRole'])->name('add.role');

    Route::post('/{id}/permissions', [RoleController::class, 'assignPermissionsToRole'])->name('add.permission.to.role');
});
