<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameProgress extends Model
{
    protected $table = 'game_progress';

    protected $fillable = [
        'user_id',
        'game_id',
        'current_level',
        'current_sub',
        'completed_json',
        'rewards_json',
        'intro_seen_json',
        'streak_json',
        'predictions_json',
        'hint_tier_json',
        'fluency_scores_json',
        'concept_log_json',
        'in_hub',
        'levels_completed_count',
        'is_any_level_finished',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_json' => 'array',
            'rewards_json' => 'array',
            'intro_seen_json' => 'array',
            'streak_json' => 'array',
            'predictions_json' => 'array',
            'hint_tier_json' => 'array',
            'fluency_scores_json' => 'array',
            'concept_log_json' => 'array',
            'in_hub' => 'boolean',
            'is_any_level_finished' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
