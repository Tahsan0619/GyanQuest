<?php

namespace App\Filament\Resources\Students\Pages;

use App\Filament\Resources\Students\StudentResource;
use Filament\Resources\Pages\ViewRecord;

class ViewStudent extends ViewRecord
{
    protected static string $resource = StudentResource::class;

    public function mount(int|string $record): void
    {
        parent::mount($record);
        $this->record->load(['gameProgress', 'writtenResponses' => fn ($q) => $q->latest()]);
    }
}
