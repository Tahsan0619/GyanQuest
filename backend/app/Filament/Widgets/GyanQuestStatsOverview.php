<?php

namespace App\Filament\Widgets;

use App\Models\GameProgress;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class GyanQuestStatsOverview extends StatsOverviewWidget
{
    protected ?string $pollingInterval = '6s';

    protected function getStats(): array
    {
        $students = User::where('role', 'student')->count();
        $pending = User::where('role', 'student')->where('status', 'pending')->count();
        $activeToday = GameProgress::where('last_synced_at', '>=', now()->subDay())->distinct('user_id')->count('user_id');
        $mostPlayed = GameProgress::selectRaw('game_id, count(*) as c')
            ->groupBy('game_id')
            ->orderByDesc('c')
            ->value('game_id') ?: '—';

        return [
            Stat::make('Students', (string) $students),
            Stat::make('Pending approvals', (string) $pending)->color('warning'),
            Stat::make('Active (24h)', (string) $activeToday),
            Stat::make('Most-played game', (string) $mostPlayed),
        ];
    }
}
