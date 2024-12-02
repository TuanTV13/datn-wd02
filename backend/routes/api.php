<?php


use App\Http\Controllers\LocationController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\CategoryController;
use App\Http\Controllers\V1\Client\CartController;
use App\Http\Controllers\V1\Client\EventController as ClientEventController;
use App\Http\Controllers\V1\Client\HistoryController;
use App\Http\Controllers\V1\Client\HomeController;
use App\Http\Controllers\V1\Client\PaymentController;
use App\Http\Controllers\V1\EventController;
use App\Http\Controllers\V1\EventTrackingController;
use App\Http\Controllers\V1\FeedbackController;
use App\Http\Controllers\V1\StatisticsController;
use App\Http\Controllers\V1\TicketController;
use App\Http\Controllers\V1\TransactionController;
use App\Http\Controllers\V1\UserController;
use App\Http\Controllers\v1\VNPayController;
use App\Http\Controllers\V1\VoucherController;
use App\Http\Services\Payments\ZaloPayService;
use App\Http\Services\VNPayService;
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
        Route::post('trashed', [EventController::class, 'trashed']);
        Route::get('{event}/show', [EventController::class, 'show']);
        Route::put('{event}/update', [EventController::class, 'update']);
        Route::delete('{event}/delete', [EventController::class, 'delete']);
        Route::post('{event}/restore', [EventController::class, 'restore']);
        Route::put('{event}/verified', [EventController::class, 'verifiedEvent']);
        Route::post('{eventId}/add-ip', [EventController::class, 'addIp']);
        Route::get('/check-event-ip', [EventController::class, 'checkEventIP']); // Thông báo hi chưa có ip checkin cục bộ
        Route::get('statistics/top-revenue-events', [StatisticsController::class, 'topRevenueEvents']); // Thống kê trong khoảng thời gian chọn
        Route::get('statistics/event-count', [StatisticsController::class, 'getEventStatistics']); // Đếm số lượng

    });

    Route::get('users', [UserController::class, 'index']);

    Route::prefix('users')->middleware(['check.jwt', 'check.permission:manage-users'])->group(function () {
        Route::get('{id}', [UserController::class, 'show']);
        Route::post('create', [UserController::class, 'create']);
        Route::delete('{id}/delete', [UserController::class, 'destroy']);
        Route::post('trashed', [UserController::class, 'trashed']); // khóa
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
        Route::post('/block', [TicketController::class, 'getAll']);
        Route::get('block/{id}', [TicketController::class, 'getBlockById']); // danh sách vé bị khóa
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

    Route::post('/apply-discount', [PaymentController::class, 'applyDiscount']);
    Route::post('vouchers/apply/{totalPrice}', [VoucherController::class, 'apply']);
    Route::get('vouchers', [VoucherController::class, 'index']);
    Route::prefix('vouchers')->middleware(['check.jwt', 'check.permission:manage-vouchers'])->group(function () {
        Route::post('create', [VoucherController::class, 'create']);
        Route::put('{id}/update', [VoucherController::class, 'update']);
        Route::delete('{id}/delete', [VoucherController::class, 'delete']);
        Route::get('trashed', [VoucherController::class, 'trashed']);
        Route::post('{id}/restore', [VoucherController::class, 'restore']);

    });

    Route::get('feedbacks', [FeedbackController::class, 'index']);
    Route::prefix('feedbacks')->middleware(['check.jwt', 'check.permission:manage-reviews'])->group(function () {
        Route::get('{event}/evaluation/{user}', [FeedbackController::class, 'getFeedbackFormData'])->middleware('signed');  // Lấy dữ liệu đổ ra form đánh giá
        Route::get('{id}/show', [FeedbackController::class, 'show']);
        Route::post('reply', [FeedbackController::class, 'reply']);
        Route::post('submit', [FeedbackController::class, 'submit']);
        Route::delete('{id}/delete', [FeedbackController::class, 'delete']);
    });

    Route::prefix('clients')->group(function () {

        Route::get('getEventDetails/{id}', [EventTrackingController::class, 'getEventDetails']);

        Route::prefix('events')->group(function () {
            Route::get('/', [ClientEventController::class, 'getByConfirmed']);
            Route::get('{id}', [ClientEventController::class, 'show'])->name('client.event.show');
            Route::put('{eventId}/checkin', [ClientEventController::class, 'checkIn']);
            Route::get('category/{categoryId}', [ClientEventController::class, 'getEventsByCategory']); // Bài viết theo danh mục
            Route::post('filter', [ClientEventController::class, 'filter']);
            Route::post('search', [ClientEventController::class, 'search']);
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


        Route::get('/statistics/category', [StatisticsController::class, 'getStatisticsByCategory']);


        Route::prefix('statistics')->group(function () {
            // Route để lấy danh sách các sự kiện có doanh thu cao nhất trong khoảng thời gian
            Route::get('/top-revenue', [StatisticsController::class, 'topRevenueEvents']);
    
            // Route để lấy thống kê số sự kiện hoàn thành trong khoảng thời gian
            Route::get('/event-statistics', [StatisticsController::class, 'getEventStatisticsByTime']);
        
            // Route để lấy thống kê sự kiện theo thể loại (chỉ sự kiện đã được xác nhận)
            Route::get('/statistics-by-category', [StatisticsController::class, 'getEventCountTotalAmountAndPercentageByEventType']);
        
            // Route để lấy thống kê sự kiện theo tỉnh/thành phố (chỉ sự kiện đã được xác nhận)
            Route::get('/statistics-by-province', [StatisticsController::class, 'getEventCountTotalAmountAndPercentageByProvince']);
        
            // Route để lấy danh sách các sự kiện có số lượng người tham gia cao nhất trong khoảng thời gian
            Route::get('/top-participants', [StatisticsController::class, 'topParticipantsEvents']);
    
    
            // Route để lấy thống kê số sự kiện đã xác nhận và bị hủy bỏ trong khoảng thời gian
            Route::get('/event-status-statistics', [StatisticsController::class, 'getEventStatusStatistics']);
    
            // Route để lấy doanh thu và số lượng người tham gia của các sự kiện trong khoảng thời gian
            Route::get('/event-revenue-participants', [StatisticsController::class, 'getEventRevenueAndParticipants']);
        });


    // Lấy danh sách giao dịch
    Route::get('/transactions', [TransactionController::class, 'getTransactionHistory']);
    
    // Lấy giao dịch theo ID
    Route::get('/transactions/{id}', [TransactionController::class, 'showTransaction']);
    
    


        });
  
    });

Route::post('/vnpay/return', [PaymentController::class, 'handleVNPayResponse']);

Route::get('/return-momo', [PaymentController::class, 'paymentSuccess']);
Route::post('/notify-momo', [PaymentController::class, 'notifyMomo']);



