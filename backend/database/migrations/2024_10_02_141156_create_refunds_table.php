<?php

use App\Models\CustomerPaymentInfo;
use App\Models\Status;
use App\Models\TransactionHistory;
use App\Models\User;
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
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(TransactionHistory::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Status::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(CustomerPaymentInfo::class)->constrained()->onDelete('cascade');
            $table->double('refund_amount', 10,2);
            $table->string('refund_reason', 255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
