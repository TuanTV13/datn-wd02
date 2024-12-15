<?php

use App\Http\Controllers\V1\Client\PaymentController;
use App\Http\Controllers\V1\FeedbackController;
use App\Http\Controllers\V1\TicketController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('feedbacks/{event}/evaluation/{user}', [FeedbackController::class, 'getFeedbackFormData'])->name('form.feedback'); // Lấy form đánh giá khi nhấn vào button trong email    
Route::post('evaluation/submit', [FeedbackController::class, 'submit'])->name('feedback.store'); // Submit form đánh giá   
Route::get('/return-vnpay', [PaymentController::class, 'handleReturn']);
Route::get('/ticket/pdf/{ticket_code}', [TicketController::class, 'generatePdf'])->name('ticket.pdf');

