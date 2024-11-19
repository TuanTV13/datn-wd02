<?php


use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\CategoryController;
use App\Http\Controllers\V1\Client\EventController as ClientEventController;
use App\Http\Controllers\V1\Client\HistoryController;
use App\Http\Controllers\V1\Client\HomeController;
use App\Http\Controllers\V1\Client\PaymentController;
use App\Http\Controllers\V1\EventController;
use App\Http\Controllers\V1\EventTrackingController;
use App\Http\Controllers\V1\FeedbackController;
use App\Http\Controllers\V1\TicketController;
use App\Http\Controllers\V1\TransactionController;
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

Route::prefix('v1/role')->middleware(['check.jwt'])->group(function () {
    Route::get('/{id}/permissions', [RolePermissionController::class, 'getPermissionsByRole']);
    Route::get('/{id}', [RolePermissionController::class, 'assignAdminRole'])->name('add.role');
    Route::post('/{id}/permissions', [RolePermissionController::class, 'assignPermissionsToRole']);
});

Route::prefix('v1')->group(function () {
    Route::get('user', [AuthController::class, 'me'])->middleware('check.jwt'); // Thông tin cá nhân của user đang login
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('email/verify/{token}', [AuthController::class, 'verify'])->name('verification.verify');
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('password/sendOTP', [AuthController::class, 'sendResetOTPEmail']);
    Route::post('password/reset', [AuthController::class, 'resetPasswordWithOTP']);

    Route::get('user/profile', [AuthController::class, 'me']);

    // Route cập nhật thông tin tài khoản
    Route::put('user/update-profile/{id}', [AuthController::class, 'updateProfile']);

    // Route thay đổi mật khẩu
    Route::put('user/change-password/{id}', [AuthController::class, 'changePassword']);

    Route::get('events', [EventController::class, 'index']);

    Route::prefix('events')->middleware(['check.jwt', 'check.permission:manage-events'])->group(function () {
        Route::post('create', [EventController::class, 'create']);
        Route::get('{event}/show', [EventController::class, 'show']);
        Route::put('{event}/update', [EventController::class, 'update']);
        Route::delete('{event}/delete', [EventController::class, 'delete']);
        Route::post('{event}/restore', [EventController::class, 'restore']);
        Route::put('{event}/verified', [EventController::class, 'verifiedEvent']);
        Route::get('/check-event-ip', [EventController::class, 'checkEventIP']); // Thông báo hi chưa có ip checkin cục bộ
        Route::post('{eventId}/add-ip', [EventController::class, 'addIp']);
    });

    Route::get('users', [UserController::class, 'index']);

    Route::prefix('users')->middleware(['check.jwt', 'check.permission:manage-users'])->group(function () {
        Route::get('{id}', [UserController::class, 'show']);
        Route::post('create', [UserController::class, 'create']);
        Route::delete('{id}/delete', [UserController::class, 'destroy']);
        Route::get('trashed', [UserController::class, 'trashed']); // khóa
        Route::post('{id}/restore', [UserController::class, 'restore']); // mở khóa
        Route::delete('{id}/force-delete', [UserController::class, 'forceDelete']); // xóa
    });

    Route::get('categories', [CategoryController::class, 'index']);

    Route::prefix('categories')->middleware(['check.jwt', 'check.permission:manage-event-categories'])->group(function () {
        Route::post('create', [CategoryController::class, 'create']);
        Route::put('{id}/update', [CategoryController::class, 'update']);
        Route::delete('{id}/delete', [CategoryController::class, 'delete']);
    });

    Route::get('tickets', [TicketController::class, 'index']);
    Route::prefix('tickets')->group(function () {
        Route::get('{id}', [TicketController::class, 'show']); // chi tiết vé
        Route::get('block', [TicketController::class, 'getByBlock']); // danh sách vé bị khóa
        Route::post('create', [TicketController::class, 'create']);
        Route::put('{id}/update', [TicketController::class, 'update']);
        Route::delete('{id}/delete', [TicketController::class, 'delete']);
        Route::post('{id}/restore', [TicketController::class, 'restoreTicket']); // mở khóa vé
        Route::put('{id}/verified', [TicketController::class, 'verifiedTicket']); // xác nhận vé
        Route::get('{eventId}/{ticketType}', [TicketController::class, 'findTicketDataByEventAndType']); // ?

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

    Route::prefix('statistics')->middleware('check.permission:view-statistics')->group(function () {
    });

    Route::prefix('clients')->group(function () {

        Route::get('getEventDetails/{id}', [EventTrackingController::class, 'getEventDetails']);

        Route::prefix('events')->group(function () {
            Route::get('/', [ClientEventController::class, 'getByConfirmed']);
            Route::get('{id}', [ClientEventController::class, 'show'])->name('client.event.show');
            Route::put('{eventId}/checkin', [ClientEventController::class, 'checkIn']);
            Route::get('category/{categoryId}', [ClientEventController::class, 'getEventsByCategory']); // Bài viết theo danh mục
        });

        Route::prefix('home')->group(function () {
            Route::get('header-events', [HomeController::class, 'headerEvents']);
            Route::get('upcoming-events/{provinceSlug?}', [HomeController::class, 'upcomingEvents']);
            Route::get('featured-events', [HomeController::class, 'featuredEvents']);
            Route::get('top-rated-events', [HomeController::class, 'topRatedEvents']);
        });

        Route::post('checkout', [PaymentController::class, 'checkout']);
        Route::post('payment/process', [PaymentController::class, 'processPayment']);
        Route::get('payment/success', [PaymentController::class, 'paymentSuccess'])->name('payment.success');
        Route::get('payment/cancel', [PaymentController::class, 'paymentCancel'])->name('payment.cancel');

        Route::get('{id}/participation-history', [HistoryController::class, 'getEventParticipationHistory'])->middleware('check.permission:view-participation-history');
        Route::get('{userId}/event/{eventID}/participation-history', [HistoryController::class, 'showParticipationHistory'])->middleware('check.permission:view-participation-history');

        Route::get('{id}/transaction-history', [HistoryController::class, 'getTransactionHistory'])->middleware('check.permission:view-transaction-history');
    });

    Route::prefix('statistics')->group(function () {

    });

});
