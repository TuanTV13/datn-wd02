<?php

use App\Models\District;
use App\Models\Province;
use App\Models\Status;
use App\Models\Ward;
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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Province::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(District::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Ward::class)->constrained()->onDelete('cascade');
            $table->string('name', 50);
            $table->string('email', 50)->unique();
            $table->string('password', 255);
            $table->string('phone', 20)->unique();
            $table->string('address', 100)->nullable();
            $table->string('image', 2048)->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->string('email_verification_token', 255)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
