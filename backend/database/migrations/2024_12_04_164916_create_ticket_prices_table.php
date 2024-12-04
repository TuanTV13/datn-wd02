<?php

use App\Models\SeatZone;
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
        Schema::create('ticket_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Ticket::class)->constrained();
            $table->foreignIdFor(SeatZone::class)->constrained();
            $table->decimal('price');
            $table->integer('quantity');
            $table->integer('sold_quantity');
            $table->dateTime('sale_start');
            $table->dateTime('sale_end');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_prices');
    }
};
