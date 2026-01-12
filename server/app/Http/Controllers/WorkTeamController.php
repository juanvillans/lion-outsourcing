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

        $workTeams = WorkTeam::with('employees')
            ->withCount('employees')
            ->orderBy('name', 'asc')->get();

        return response()->json(['data' => $workTeams]);
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

    public function addEmployee(Request $request, WorkTeam $workTeam)
    {
        try {

            $request->validate([
                'employee_id' => ['required', 'exists:employees,id']
            ]);

            if ($workTeam->employees()->where('employee_id', $request->employee_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'El empleado ya pertenece a este equipo'
                ], 409);
            }

            $workTeam->employees()->attach($request->employee_id);


            return response()->json([
                'success' => true,
                'message' => 'Empleado agregado al equipo exitosamente',
            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Log::error('Error al agregar empleado al equipo', [
                'work_team_id' => $workTeam->id,
                'employee_id' => $request->employee_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al agregar empleado al equipo'
            ], 500);
        }
    }

    public function removeEmployee(Request $request, WorkTeam $workTeam)
    {
        try {

            $request->validate([
                'employee_id' => ['required', 'exists:employees,id']
            ]);

            if (!$workTeam->employees()->where('employee_id', $request->employee_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'El empleado no pertenece a este equipo'
                ], 404);
            }

            $workTeam->employees()->detach($request->employee_id);

            $workTeam->load('employees');

            return response()->json([
                'success' => true,
                'message' => 'Empleado removido del equipo exitosamente',
                'data' => [
                    'work_team' => $workTeam,
                ]
            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Log::error('Error al remover empleado del equipo', [
                'work_team_id' => $workTeam->id,
                'employee_id' => $request->employee_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al remover empleado del equipo'
            ], 500);
        }
    }
}
