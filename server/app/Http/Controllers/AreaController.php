<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Area;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AreaController extends Controller
{

    public function index()
    {

        $areas = Area::with('industry')->orderBy('name', 'asc')->get();

        return response()->json(['data' => $areas]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'industry_id' => 'nullable|integer|exists:industries,id',
            ]);

            $area = Area::create($request->only(['name', 'industry_id']));
            $area->load('industry');

            return response()->json([
                'status' => true,
                'data' => $area
            ]);
        } catch (Exception $e) {

            Log::info('Error al crear area', ['name' => $request->name]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, Area $area)
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'name' => 'sometimes|required',
                'industry_id' => 'nullable|integer|exists:industries,id',
            ]);

            $area->update($request->only(['name', 'industry_id']));
            $area->load('industry');

            DB::commit();

            return response()->json([
                'status' => true,
                'data' => $area
            ]);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Area no encontrada'
            ], 404);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error al actualizar area', [
                'data' => $area,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar area: ' . $e->getMessage()
            ], 500);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(Area $area)
    {


        try {

            $area->delete(); // Ejecuta observer

            return response()->json([
                'success' => true,
                'message' => 'Area eliminada exitosamente'
            ]);
        } catch (Exception $e) {

            Log::info('Error al eliminar area: ', ['area' => $area]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar area'
            ]);
        }
    }
}
