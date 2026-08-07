<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConceptLog;
use Illuminate\Http\Request;

class ConceptLogController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'term' => ['required', 'string', 'max:190'],
            'subject' => ['nullable', 'string', 'max:120'],
            'level' => ['nullable', 'integer', 'min:0', 'max:20'],
        ]);

        $row = ConceptLog::create([
            'user_id' => $request->user()->id,
            'term' => $data['term'],
            'subject' => $data['subject'] ?? '',
            'level' => $data['level'] ?? 0,
        ]);

        return response()->json(['concept_log' => $row], 201);
    }
}
