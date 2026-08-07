<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WrittenResponse;
use Illuminate\Http\Request;

class ResponseController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'game_id' => ['required', 'string', 'max:64'],
            'level' => ['nullable', 'integer', 'min:0', 'max:20'],
            'source' => ['required', 'in:glossary_build,chatbot_question,chatbot_answer'],
            'term' => ['nullable', 'string', 'max:190'],
            'content' => ['required', 'string'],
        ]);

        $row = WrittenResponse::create([
            'user_id' => $request->user()->id,
            'game_id' => $data['game_id'],
            'level' => $data['level'] ?? 0,
            'source' => $data['source'],
            'term' => $data['term'] ?? null,
            'content' => $data['content'],
        ]);

        return response()->json(['response' => $row], 201);
    }
}
