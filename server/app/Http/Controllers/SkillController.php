<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Skill;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Services\SkillService;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SkillController extends Controller
{

    protected $skillService;

    public function __construct()
    {
        $this->skillService = new SkillService;
    }

    public function index(Request $request)
    {

        try {
            $validated = $request->validate([
                'search' => 'nullable|string|max:255',
                'page' => 'nullable|integer|min:1',
                'per_page' => 'nullable|integer|min:1|max:100',
                'starts_with' => 'nullable|string|max:100',
                'ends_with' => 'nullable|string|max:100',
            ]);

            $result = $this->skillService->get($validated);

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

            Log::error("Error obteniendo skills", ['message' => $e->getMessage(), 'line' => $e->getLine()]);

            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda'
            ], 500);
        }
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

    public function getNewSkills()
    {
        $newSkillsFromEmployeeRequests = EmployeeRequest::select('new_skills')->get()->pluck('new_skills')->toArray();
        $newSkillsFromEmployees = Employee::select('new_skills')->get()->pluck('new_skills')->toArray();

        $result = array_merge($newSkillsFromEmployeeRequests, $newSkillsFromEmployees);

        $result = array_merge(...$result);

        return $result;
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate(
                ['name' => 'required|string|max:120']
            );

            Skill::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Skill creada exitosamente'
            ]);
        } catch (ValidationException $e) {


            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        } catch (Exception $e) {

            Log::error("Error creado skill", ['message' => $e->getMessage(), 'line' => $e->getLine()]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear skill'
            ], 500);
        }
    }

    public function update(Request $request, Skill $skill)
    {
        try {
            $validated = $request->validate(
                ['name' => 'required|string|max:120']
            );

            $skill->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Skill actualizada exitosamente'
            ]);
        } catch (ValidationException $e) {


            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        } catch (Exception $e) {

            Log::error("Error creado skill", ['message' => $e->getMessage(), 'line' => $e->getLine()]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear skill'
            ], 500);
        }
    }

    public function destroy(Skill $skill)
    {
        try {

            $skill->delete();

            return response()->json([
                'success' => true,
                'message' => 'Skill eliminada exitosamente'
            ]);
        } catch (Exception $e) {

            Log::info('Error al eliminar skill: ', ['skill' => $skill]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar area'
            ]);
        }
    }
}
