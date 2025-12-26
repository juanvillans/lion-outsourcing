<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Industry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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
            ]);

            $industry = Industry::create(['name' => $request->name]);
            $industry->areas = [];

            return response()->json([
                'status' => true,
                'data' => $industry
            ]);
        } catch (Exception $e) {

            Log::info('Error al crear industria', ['name' => $request->name]);

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
}
