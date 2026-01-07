<?php

namespace App\Http\Controllers;

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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $request->validate([
                'name' => 'required|string'
            ]);

            $workTeam = WorkTeam::create(['name' => $request->name]);

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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkTeam $workTeam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WorkTeam $workTeam)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkTeam $workTeam)
    {
        //
    }
}
