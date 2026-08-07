<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameProgress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function index(Request $request)
    {
        $rows = GameProgress::query()
            ->where('user_id', $request->user()->id)
            ->orderBy('game_id')
            ->get();

        return response()->json(['progress' => $rows]);
    }

    public function sync(Request $request)
    {
        $data = $request->validate([
            'game_id' => ['required', 'string', 'max:64'],
            'level' => ['nullable', 'integer', 'min:0', 'max:20'],
            'sub' => ['nullable', 'integer', 'min:0', 'max:20'],
            'inHub' => ['nullable', 'boolean'],
            'completed' => ['nullable', 'array'],
            'rewards' => ['nullable', 'array'],
            'introSeen' => ['nullable', 'array'],
            'streaks' => ['nullable', 'array'],
            'predictions' => ['nullable', 'array'],
            'hintTiers' => ['nullable', 'array'],
            'fluencyScores' => ['nullable', 'array'],
            'conceptLog' => ['nullable', 'array'],
        ]);

        $completed = $data['completed'] ?? [];
        $levelsDone = 0;
        foreach ($completed as $row) {
            if (is_array($row) && count($row) && collect($row)->every(fn ($v) => (bool) $v)) {
                $levelsDone++;
            }
        }

        $row = GameProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'game_id' => $data['game_id'],
            ],
            [
                'current_level' => $data['level'] ?? 0,
                'current_sub' => $data['sub'] ?? 0,
                'in_hub' => array_key_exists('inHub', $data) ? (bool) $data['inHub'] : true,
                'completed_json' => $completed,
                'rewards_json' => $data['rewards'] ?? [],
                'intro_seen_json' => $data['introSeen'] ?? [],
                'streak_json' => $data['streaks'] ?? null,
                'predictions_json' => $data['predictions'] ?? null,
                'hint_tier_json' => $data['hintTiers'] ?? null,
                'fluency_scores_json' => $data['fluencyScores'] ?? null,
                'concept_log_json' => $data['conceptLog'] ?? null,
                'levels_completed_count' => $levelsDone,
                'is_any_level_finished' => $levelsDone > 0,
                'last_synced_at' => now(),
            ]
        );

        return response()->json(['progress' => $row]);
    }
}
