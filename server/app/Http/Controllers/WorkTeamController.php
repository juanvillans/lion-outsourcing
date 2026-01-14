<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Exception;
use App\Models\WorkTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use League\Config\Exception\ValidationException;

class WorkTeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workTeams = WorkTeam::withCount('employees')->orderBy('name', 'asc')->get();

        return response()->json(['data' => $workTeams]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'is_hired' => 'nullable|boolean',
                'end_date_contract' => 'nullable|date'
            ]);

            $workTeam = WorkTeam::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Nuevo equipo creado',
                'data' => $workTeam
            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {

            Log::info('Error al crear equipo de trabajo', ['name' => $request->name]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear equipo de trabajo'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkTeam $workTeam)
    {

        $data = WorkTeam::where('id', $workTeam->id)
            ->with('employees.industry', 'employees.area')
            ->withCount('employees')
            ->orderBy('name', 'asc')->first();

        return response()->json(['data' => $data]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkTeam $workTeam)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string',
                'description' => 'nullable|string',
                'is_hired' => 'nullable|boolean',
                'end_date_contract' => 'nullable|date'
            ]);

            $workTeam->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Equipo actualizado',
                'data' => $workTeam
            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {

            Log::info('Error al actualizar equipo de trabajo', ['name' => $request->name]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar equipo de trabajo'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkTeam $workTeam)
    {
        try {

            $workTeam->employees()->detach();
            $workTeam->delete();

            return response()->json([
                'success' => true,
                'message' => 'Equipo eliminado exitosamente',
            ]);
        } catch (Exception $e) {

            Log::info('Error al eliminar equipo de trabajo', ['name' => $request->name]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar equipo de trabajo'
            ]);
        }
    }

    public function addEmployees(Request $request, WorkTeam $workTeam)
    {
        try {
            $request->validate([
                'employee_ids' => ['required', 'array', 'min:1'],
                'employee_ids.*' => ['exists:employees,id']
            ]);

            $existingEmployeeIds = $workTeam->employees()
                ->whereIn('employee_id', $request->employee_ids)
                ->pluck('employee_id')
                ->toArray();

            $newEmployeeIds = array_diff($request->employee_ids, $existingEmployeeIds);

            if (empty($newEmployeeIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Todos los empleados ya pertenecen a este equipo',
                    'data' => [
                        'existing_employees' => $existingEmployeeIds
                    ]
                ], 409);
            }

            $workTeam->employees()->attach($newEmployeeIds);

            return response()->json([
                'success' => true,
                'message' => count($newEmployeeIds) . ' empleado(s) agregado(s) al equipo exitosamente',
                'data' => [
                    'added_employee_ids' => $newEmployeeIds,
                    'already_in_team' => $existingEmployeeIds
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->getMessage()
            ], 422);
        } catch (Exception $e) {
            Log::error('Error al agregar empleados al equipo', [
                'work_team_id' => $workTeam->id,
                'employee_ids' => $request->employee_ids ?? [],
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al agregar empleados al equipo'
            ], 500);
        }
    }

    public function removeEmployees(Request $request, WorkTeam $workTeam)
    {
        try {
            $request->validate([
                'employee_ids' => ['required', 'array', 'min:1'],
                'employee_ids.*' => ['exists:employees,id']
            ]);

            $employeesInTeam = $workTeam->employees()
                ->whereIn('employee_id', $request->employee_ids)
                ->pluck('employee_id')
                ->toArray();

            if (empty($employeesInTeam)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ninguno de los empleados pertenece a este equipo',
                    'data' => [
                        'requested_ids' => $request->employee_ids
                    ]
                ], 404);
            }

            $workTeam->employees()->detach($employeesInTeam);

            $notInTeamIds = array_diff($request->employee_ids, $employeesInTeam);

            $message = count($employeesInTeam) . ' empleado(s) removido(s) del equipo';
            if (!empty($notInTeamIds)) {
                $message .= ' (' . count($notInTeamIds) . ' no estaban en el equipo)';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'removed_employee_ids' => $employeesInTeam,
                    'not_in_team' => $notInTeamIds
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->getMessage()
            ], 422);
        } catch (Exception $e) {
            Log::error('Error al remover empleados del equipo', [
                'work_team_id' => $workTeam->id,
                'employee_ids' => $request->employee_ids ?? [],
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al remover empleados del equipo'
            ], 500);
        }
    }
}
