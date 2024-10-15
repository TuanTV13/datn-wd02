<?php


use App\Http\Controllers\LocationController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\CategoryController;
use App\Http\Controllers\V1\Client\EventController as ClientEventController;
use App\Http\Controllers\V1\EventController;
use App\Http\Controllers\V1\TicketController;
use App\Http\Controllers\V1\UserController;
use App\Http\Controllers\V1\VoucherController;
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

Route::prefix('locations')->group(function () {
    Route::get('/provinces', [LocationController::class, 'showProvinces']);
    Route::get('/districts/{provinceId}', [LocationController::class, 'getDistricts']);
    Route::get('/wards/{districtId}', [LocationController::class, 'getWards']);
});

Route::prefix('role')->middleware(['check.jwt'])->group(function () {
    Route::get('/{id}/permissions', [RolePermissionController::class, 'getPermissionsByRole']);
    Route::get('/{id}', [RolePermissionController::class, 'assignAdminRole'])->name('add.role');
    Route::post('/{id}/permissions', [RolePermissionController::class, 'assignPermissionsToRole']);
});

Route::prefix('v1')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('email/verify/{token}', [AuthController::class, 'verify'])->name('verification.verify');
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('password/sendOTP', [AuthController::class, 'sendResetOTPEmail']);
    Route::post('password/reset', [AuthController::class, 'resetPasswordWithOTP']);

    Route::get('events', [EventController::class, 'index']);

    Route::prefix('events')->middleware(['check.jwt', 'check.permission:manage-events'])->group(function () {
        Route::post('create', [EventController::class, 'create']);
        Route::put('{event}/update', [EventController::class, 'update']);
        Route::delete('{event}/delete', [EventController::class, 'delete']);
        Route::post('{event}/restore', [EventController::class, 'restore']);
    });

    Route::get('users', [UserController::class, 'index']);

    Route::prefix('users')->middleware(['check.jwt', 'check.permission:manage-users'])->group(function () {
        Route::post('create', [UserController::class, 'create']);
        Route::delete('{id}/delete', [UserController::class, 'delete']);
        Route::get('trashed', [UserController::class, 'trashed']);
        Route::post('{id}/restore', [UserController::class, 'restore']);
    });

    Route::get('categories', [CategoryController::class, 'index']);

    Route::prefix('categories')->middleware(['check.jwt', 'check.permission:manage-categories'])->group(function () {
        Route::post('create', [CategoryController::class, 'create']);
        Route::put('{id}/update', [CategoryController::class, 'update']);
        Route::delete('{id}/delete', [CategoryController::class, 'delete']);
    });

    Route::get('tickets', [TicketController::class, 'index']);
    Route::prefix('tickets')->middleware(['check.jwt','check.permission:manage-tickets'])->group( function () {
        Route::post('create', [TicketController::class, 'create']);
        Route::put('{id}/update', [TicketController::class, 'update']);
        Route::delete('{id}/delete', [TicketController::class, 'delete']);
        Route::post('{id}/restore', [TicketController::class, 'restoreTicket']);
        Route::put('{id}/verified', [TicketController::class, 'verifiedTicket']);
    });


    Route::prefix('vouchers')->middleware(['check.jwt','check.permission:manage-vouchers'])->group( function () {
        Route::post('create', [VoucherController::class, 'create']);
    });

    Route::prefix('clients')->group(function () {
        Route::get('events', [ClientEventController::class, 'index']);
        Route::get('events/{id}', [ClientEventController::class, 'show']);
        Route::get('events/filter/{categoryId}', [ClientEventController::class, 'filter']);
    });
});