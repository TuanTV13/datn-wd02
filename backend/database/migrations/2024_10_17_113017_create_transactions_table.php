<?php

use App\Enums\PaymentMethod;
use App\Enums\TransactionStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('event_id')->constrained();
            $table->string('transaction_code')->unique();
            $table->integer('quantity');
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_method', PaymentMethod::getValues())->default(PaymentMethod::CASH);
            $table->enum('status', TransactionStatus::getValues())->default(TransactionStatus::PENDING);
            $table->json('tickets'); // Lưu thông tin vé dưới dạng JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
