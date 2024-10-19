<?php

use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\V1\VoucherController;
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

// Route::get('/abc/{id}', [EventController::class, 'update']);

// Route::get('vouchers', [VoucherController::class, 'index'])->name('index');
// // Route::get('voucher/create', [VoucherController::class, 'create'])->name('create');
// Route::post('voucher', [VoucherController::class, 'create'])->name('create');
// // Route::get('voucher/{id}edit', [VoucherController::class, 'edit'])->name('edit');
// Route::put('voucher/{id}', [VoucherController::class, 'update'])->name('update');
// Route::post('voucher/apply', [VoucherController::class, 'apply'])->name('apply');
// Route::delete('voucher/{id}', [VoucherController::class, 'delete'])->name('delete');
// Route::get('vouchers/trashed', [VoucherController::class, 'trashed'])->name('trashed');
// Route::post('voucher/{id}/restore', [VoucherController::class, 'restore'])->name('restore');