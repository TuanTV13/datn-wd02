<?php

use App\Models\Event;
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
        Schema::create('user_event', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Event::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Ticket::class)->constrained()->nullable()->onDelete('cascade');
            $table->enum('status', ['registered', 'attended', 'cancelled'])->default('registered');
            $table->dateTime('registered_at')->comment('Thời gian người dùng đăng ký sự kiện');
            $table->dateTime('attended_at')->nullable()->comment('Thời gian người dùng tham gia sự kiện');
            $table->dateTime('cancelled_at')->nullable()->comment('Thời gian người dùng hủy sự kiện');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_event');
    }
};
