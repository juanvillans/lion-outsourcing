<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Services\EmployeeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{

    protected $employeeService;

    public function __construct()
    {
        $this->employeeService = new EmployeeService;
    }

    public function index(Request $request)
    {
        try {

            $validated = $request->validate([
                'page' => 'nullable|integer|min:1',
                'per_page' => 'nullable|integer|min:1|max:100',
                'search' => 'nullable|string|max:255',
                'status' => 'nullable|in:pending,accepted,rejected',
                'industry_id' => 'nullable|exists:industries,id',
                'area_id' => 'nullable|exists:areas,id',
                'english_level' => 'nullable|in:none,beginner,intermediate,advanced',
                'sort_by' => 'nullable|in:created_at,fullname,desired_monthly_income,status',
                'sort_direction' => 'nullable|in:asc,desc',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date|after_or_equal:date_from',
            ]);

            $employees = $this->employeeService->getAll($validated);

            return response()->json([
                'success' => true,
                'data' => $employees->items(),
                'meta' => [
                    'current_page' => $employees->currentPage(),
                    'last_page' => $employees->lastPage(),
                    'per_page' => $employees->perPage(),
                    'total' => $employees->total(),
                    'from' => $employees->firstItem(),
                    'to' => $employees->lastItem(),
                ]
            ]);
        } catch (Exception $e) {
            Log::error("Error al obtener empleados: ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los empleados',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }





    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        try {
            DB::beginTransaction();

            $this->employeeService->destroy($employee);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'Empleado eliminado exitosamente'
            ]);
        } catch (Exception $e) {
        }
    }
}
