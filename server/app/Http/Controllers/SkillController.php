<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Services\SkillService;
use Illuminate\Support\Facades\Log;

class SkillController extends Controller
{

    protected $skillService;

    public function __construct()
    {
        $this->skillService = new SkillService;
    }


    public function searchSkills(Request $request)
    {
        try {
            $validated = $request->validate([
                'search' => 'nullable|string|max:255',
                'page' => 'nullable|integer|min:1',
                'per_page' => 'nullable|integer|min:1|max:100',
                'starts_with' => 'nullable|string|max:100',
                'ends_with' => 'nullable|string|max:100',
            ]);

            $result = $this->skillService->searchSkills($validated);

            return response()->json([
                'success' => true,
                'data' => $result->items(),
                'meta' => [
                    'current_page' => $result->currentPage(),
                    'last_page' => $result->lastPage(),
                    'per_page' => $result->perPage(),
                    'total' => $result->total(),
                    'has_results' => $result->total() > 0
                ]
            ]);
        } catch (Exception $e) {

            Log::error("Error buscando skills", ['message' => $e->getMessage(), 'line' => $e->getLine()]);

            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda'
            ], 500);
        }
    }
}
