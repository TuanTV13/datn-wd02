<?php


use App\Http\Controllers\LocationController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\CategoryController;
use App\Http\Controllers\V1\Client\CartController;
use App\Http\Controllers\V1\Client\EventController as ClientEventController;
use App\Http\Controllers\V1\Client\HomeController;
use App\Http\Controllers\V1\Client\PaymentController;
use App\Http\Controllers\V1\EventController;
use App\Http\Controllers\V1\EventTrackingController;
use App\Http\Controllers\V1\FeedbackController;
use App\Http\Controllers\V1\TicketController;
use App\Http\Controllers\V1\TransactionController;
use App\Http\Controllers\V1\UserController;
use App\Http\Controllers\v1\VNPayController;
use App\Http\Controllers\V1\VoucherController;
use App\Http\Services\Payments\VNPayService;
use App\Http\Services\Payments\ZaloPayService;
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

Route::prefix('v1/locations')->group(function () {
    Route::get('/provinces', [LocationController::class, 'showProvinces']);
    Route::get('/districts/{provinceId}', [LocationController::class, 'getDistricts']);
    Route::get('/wards/{districtId}', [LocationController::class, 'getWards']);
});

Route::prefix('v1/role')->middleware(['check.jwt'])->group(function () {
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
        Route::get('{event}/show', [EventController::class, 'show']);
        Route::put('{event}/update', [EventController::class, 'update']);
        Route::delete('{event}/delete', [EventController::class, 'delete']);
        Route::post('{event}/restore', [EventController::class, 'restore']);
        Route::put('{event}/verified', [EventController::class, 'verifiedEvent']);
    });

    Route::get('users', [UserController::class, 'index']);

    Route::prefix('users')->middleware(['check.jwt', 'check.permission:manage-users'])->group(function () {
        Route::post('create', [UserController::class, 'create']);
        Route::delete('{id}/delete', [UserController::class, 'destroy']);
        Route::get('trashed', [UserController::class, 'trashed']);
        Route::post('{id}/restore', [UserController::class, 'restore']);
    });

    Route::get('categories', [CategoryController::class, 'index']);

    Route::prefix('categories')->middleware(['check.jwt', 'check.permission:manage-event-categories'])->group(function () {
        Route::post('create', [CategoryController::class, 'create']);
        Route::put('{id}/update', [CategoryController::class, 'update']);
        Route::delete('{id}/delete', [CategoryController::class, 'delete']);
    });

    Route::get('tickets', [TicketController::class, 'index']);
    Route::prefix('tickets')->middleware(['check.jwt', 'check.permission:manage-tickets'])->group(function () {
        Route::post('create', [TicketController::class, 'create']);
        Route::put('{id}/update', [TicketController::class, 'update']);
        Route::delete('{id}/delete', [TicketController::class, 'delete']);
        Route::post('{id}/restore', [TicketController::class, 'restoreTicket']);
        Route::put('{id}/verified', [TicketController::class, 'verifiedTicket']);
    });

    Route::prefix('transactions')->middleware(['check.jwt'])->group(function () {
        Route::get('/', [TransactionController::class, 'index']);
        Route::get('{id}/detail', [TransactionController::class, 'show']);
        Route::put('{id}/verified', [TransactionController::class, 'verified']);
        Route::put('{id}/failed', [TransactionController::class, 'failed']);
    });

    Route::get('vouchers', [VoucherController::class, 'index']);
    Route::prefix('vouchers')->middleware(['check.jwt', 'check.permission:manage-vouchers'])->group(function () {
        Route::post('create', [VoucherController::class, 'create']);
        Route::put('{id}/update', [VoucherController::class, 'update']);
        Route::delete('{id}/delete', [VoucherController::class, 'delete']);
        Route::get('trashed', [VoucherController::class, 'trashed']);
        Route::post('{id}/restore', [VoucherController::class, 'restore']);
        Route::post('apply', [VoucherController::class, 'apply']);
    });

    Route::get('feedbacks', [FeedbackController::class, 'index']);  
    Route::prefix('feedbacks')->middleware(['check.jwt', 'check.permission:manage-reviews'])->group(function () {  
        Route::get('{event}/evaluation/{user}', [FeedbackController::class, 'getFeedbackFormData']);  // Lấy dữ liệu đổ ra form đánh giá  
        Route::get('{id}/show', [FeedbackController::class, 'show']);   
        Route::post('submit', [FeedbackController::class, 'submit']);  
        Route::delete('{id}/delete', [FeedbackController::class, 'delete']);   
    });  

    Route::get('getEventDetails/{id}', [EventTrackingController::class, 'getEventDetails']);
    Route::prefix('clients')->group(function () {

        Route::prefix('events')->group(function () {
            Route::get('/', [ClientEventController::class, 'index']);
            Route::get('{id}', [ClientEventController::class, 'show']);
            Route::put('{eventId}/checkin', [ClientEventController::class, 'checkIn']);
        });

        Route::prefix('home')->group(function () {
            Route::get('header-events', [HomeController::class, 'headerEvents']);
            Route::get('upcoming-events', [HomeController::class, 'upcomingEvents']);
            Route::get('featured-events', [HomeController::class, 'featuredEvents']);
            Route::get('top-rated-events', [HomeController::class, 'topRatedEvents']);
        });

        Route::prefix('carts')->middleware('check.jwt')->group(function () {
            Route::get('/', [CartController::class, 'getCart']);
            Route::post('add', [CartController::class, 'addToCart']);
            Route::put('{cartItem}/increase', [CartController::class, 'increaseQuantity']);
            Route::put('{cartItem}/decrease', [CartController::class, 'decreaseQuantity']);
        });

        Route::post('checkout', [PaymentController::class, 'checkout']);
        Route::post('payment/process', [PaymentController::class, 'processPayment']);
        Route::get('payment/success', [PaymentController::class, 'paymentSuccess'])->name('payment.success');
        Route::get('payment/cancel', [PaymentController::class, 'paymentCancel'])->name('payment.cancel');
    });
});
