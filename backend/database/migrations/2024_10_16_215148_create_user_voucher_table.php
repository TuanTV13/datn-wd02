<?php

use App\Models\User;
use App\Models\Voucher;
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
        Schema::create('user_voucher', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Voucher::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->integer('used_count')->default(0)->comment('Số lần người dùng đã sử dụng voucher');
            $table->double('discount_value', 10, 2)->comment('Giá trị giảm giá của voucher');
            $table->enum('discount_type', ['percent', 'fixed'])->comment('Loại giảm giá của voucher tại thời điểm sử dụng');
            $table->dateTime('used_at')->comment('Thời gian người dùng sử dụng voucher');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_voucher');
    }
};
