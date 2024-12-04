<?php

use App\Enums\TicketStatus;
use App\Enums\TicketType as EnumsTicketType;
use App\Models\Event;
use App\Models\Status;
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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Event::class)->constrained()->onDelete('cascade');
            $table->enum('status', TicketStatus::getValues())->default(TicketStatus::PENDING);
            $table->enum('ticket_type', EnumsTicketType::getValues());
            // $table->decimal('price', 10, 2);
            // $table->bigInteger('quantity');
            // $table->bigInteger('available_quantity')->nullable();
            // $table->string('seat_location', 100);
            // $table->dateTime('sale_start');
            // $table->dateTime('sale_end');
            // $table->text('description')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
