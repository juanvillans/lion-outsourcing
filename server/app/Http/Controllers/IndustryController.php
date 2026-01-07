<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Area;
use App\Models\Industry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class IndustryController extends Controller
{

    public function getIndustries()
    {
        $industries = Industry::with('areas')->orderBy('name', 'asc')->get();

        return response()->json(['data' => $industries]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required',
                'areas' => 'array|nullable',
                'areas.*.name' => 'required|string'
            ]);

            $industry = Industry::create(['name' => $request->name]);
            if ($request->has('areas') && !empty($request->areas)) {
                $industry->areas()->createMany($request->areas);
                $industry->load('areas');
            } else {

                $industry->areas = [];
            }

            return response()->json([
                'status' => true,
                'data' => $industry
            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {

            Log::info('Error al crear industria', ['name' => $request->name]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, Industry $industry)
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'name' => 'sometimes|required',
                'areas' => 'array|nullable',
                'areas.*.id' => 'nullable|integer|exists:areas,id',
                'areas.*.name' => 'string'
            ]);

            if ($request->has('name')) {
                $industry->name = $request->name;
                $industry->save();
            }

            if ($request->has('areas')) {

                Log::info('aca');

                $areasToKeep = [];

                foreach ($request->areas as $areaData) {
                    if (isset($areaData['id'])) {
                        // Área existente
                        $area = Area::findOrFail($areaData['id']);

                        // Verificar que pertenezca a esta industria (opcional)
                        if ($area->industry_id != $industry->id) {
                            throw new Exception("El área: " . $area->name . " no pertenece a esta industria");
                        }
                        if (isset($areaData['name']) && $area->name != $areaData['name']) {
                            $area->name = $areaData['name'];
                            $area->save();
                        }
                        $areasToKeep[] = $areaData['id'];
                    } else {
                        $createdArea = $industry->areas()->create([
                            'name' => $areaData['name']
                        ]);

                        $areasToKeep[] = $createdArea->id;
                    }
                }

                $areasToDelete = $industry->areas()
                    ->whereNotIn('id', $areasToKeep)
                    ->get();

                foreach ($areasToDelete as $area) {
                    // Opción 1: Eliminar físicamente
                    // $area->delete();

                    // // Opción 2: Desvincular (recomendado)
                    $area->industry_id = null;
                    $area->save();
                }
            }

            // Recargar la relación con las áreas actualizadas
            $industry->load('areas');

            DB::commit();

            return response()->json([
                'status' => true,
                'data' => $industry
            ]);
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Industria o área no encontrada'
            ], 404);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error al actualizar industria', [
                'data' => $industry,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la industria: ' . $e->getMessage()
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

    public function destroy(Industry $industry)
    {

        DB::beginTransaction();

        try {

            Area::where('industry_id', $industry->id)->update(['industry_id' => null]);

            $industry->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Industria eliminada exitosamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            Log::info('Error al eliminar industria: ', ['industry' => $industry]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar industria'
            ]);
        }
    }
}
