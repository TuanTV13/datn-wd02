<?php

use App\Enums\VoucherStatus;
use App\Models\Event;
use App\Models\Status;
use App\Models\Ticket;
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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'creator_id')->constrained('users')->onDelete('cascade');
            $table->foreignIdFor(Event::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Ticket::class)->constrained()->onDelete('cascade')->nullable();
            $table->foreignIdFor(Status::class)->constrained()->onDelete('cascade');
            // $table->enum('status', VoucherStatus::getValues())->default(VoucherStatus::DRAFT);
            $table->string('code', 100)->unique();
            $table->string('description')->nullable();
            $table->enum('discount_type', ['percent', 'fixed']);
            $table->double('discount_value', 10,2);
            $table->double('min_ticket_value', 10, 2)->nullable()->comment('Giá trị tối thiểu của vé được áp dụng voucher');
            $table->double('max_ticket_value', 10, 2)->nullable()->comment('Giá trị tối đa của vé được áp dụng voucher');
            $table->integer('issue_quantity')->default(1)->comment('Số lượng voucher được phát hành');
            $table->dateTime('start_time')->comment('Thời gian voucher bắt đầu có hiệu lực');
            $table->dateTime('end_time')->comment('Thời gian voucher hết hiệu lực');
            $table->bigInteger('used_limit')->default(1)->comment('Số lần sử dụng tối đa của một voucher/event');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
