<?php

namespace App\Filament\Resources\PendingUsers\Pages;

use App\Filament\Resources\PendingUsers\PendingUserResource;
use Filament\Resources\Pages\ListRecords;

class ListPendingUsers extends ListRecords
{
    protected static string $resource = PendingUserResource::class;
}
