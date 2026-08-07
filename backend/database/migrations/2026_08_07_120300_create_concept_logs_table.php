<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('concept_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('term');
            $table->string('subject')->default('');
            $table->unsignedTinyInteger('level')->default(0);
            $table->timestamps();
            $table->index(['user_id', 'term']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('concept_logs');
    }
};
