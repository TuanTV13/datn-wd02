<?php

use App\Http\Controllers\V1\EventController;
use App\Http\Controllers\V1\FeedbackController;
use App\Http\Controllers\web\SetLangController;
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

Route::get('feedbacks/{event}/evaluation/{user}', [FeedbackController::class, 'getFeedbackFormData'])->name('form.feedback')->middleware('signed'); // Lấy form đánh giá khi nhấn vào button trong email    
Route::post('evaluation/submit', [FeedbackController::class, 'submit'])->name('feedback.store'); // Submit form đánh giá   