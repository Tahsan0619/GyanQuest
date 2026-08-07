<?php

namespace App\Filament\Resources\Students;

use App\Filament\Resources\Students\Pages\ListStudents;
use App\Filament\Resources\Students\Pages\ViewStudent;
use App\Models\User;
use BackedEnum;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class StudentResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationLabel = 'Students';

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?int $navigationSort = 2;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('role', 'student');
    }

    public static function table(Table $table): Table
    {
        return $table
            ->poll('8s')
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('email')->searchable(),
                TextColumn::make('status')->badge(),
                TextColumn::make('created_at')->label('Registered')->date()->sortable(),
                TextColumn::make('games_with_progress')
                    ->label('Games')
                    ->state(fn (User $r) => $r->gameProgress()->count()),
                TextColumn::make('levels_done')
                    ->label('Levels done')
                    ->state(fn (User $r) => (int) $r->gameProgress()->sum('levels_completed_count')),
                TextColumn::make('last_active')
                    ->label('Last active')
                    ->state(fn (User $r) => optional($r->gameProgress()->max('last_synced_at'))),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'pending' => 'Pending',
                    'approved' => 'Approved',
                    'rejected' => 'Rejected',
                ]),
            ])
            ->recordUrl(fn (User $record) => static::getUrl('view', ['record' => $record]));
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([
            TextEntry::make('name'),
            TextEntry::make('email'),
            TextEntry::make('status'),
            RepeatableEntry::make('gameProgress')
                ->label('Per-game progress')
                ->schema([
                    TextEntry::make('game_id'),
                    TextEntry::make('current_level'),
                    TextEntry::make('current_sub'),
                    TextEntry::make('levels_completed_count'),
                    TextEntry::make('is_any_level_finished'),
                    TextEntry::make('last_synced_at')->dateTime(),
                ]),
            RepeatableEntry::make('writtenResponses')
                ->label('Written responses')
                ->schema([
                    TextEntry::make('game_id'),
                    TextEntry::make('source'),
                    TextEntry::make('term'),
                    TextEntry::make('content')->columnSpanFull(),
                    TextEntry::make('created_at')->dateTime(),
                ]),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListStudents::route('/'),
            'view' => ViewStudent::route('/{record}'),
        ];
    }
}
