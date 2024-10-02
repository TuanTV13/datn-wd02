<?php

use App\Models\Status;
use App\Models\Ticket;
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
            $table->foreignIdFor(Ticket::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Status::class)->constrained()->onDelete('cascade');
            $table->string('code', 100)->unique();
            $table->double('discount_amount', 10,2);
            $table->dateTime('expiration_date');
            $table->bigInteger('used_limit');
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
