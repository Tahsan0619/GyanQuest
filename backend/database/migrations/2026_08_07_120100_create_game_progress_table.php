<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('game_id', 64);
            $table->unsignedTinyInteger('current_level')->default(0);
            $table->unsignedTinyInteger('current_sub')->default(0);
            $table->json('completed_json')->nullable();
            $table->json('rewards_json')->nullable();
            $table->json('intro_seen_json')->nullable();
            $table->json('streak_json')->nullable();
            $table->json('predictions_json')->nullable();
            $table->json('hint_tier_json')->nullable();
            $table->json('fluency_scores_json')->nullable();
            $table->json('concept_log_json')->nullable();
            $table->boolean('in_hub')->default(true);
            $table->unsignedInteger('levels_completed_count')->default(0);
            $table->boolean('is_any_level_finished')->default(false);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'game_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_progress');
    }
};
