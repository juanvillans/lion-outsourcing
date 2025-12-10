<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\EmployeeRequestService;
use App\Http\Requests\StoreEmployeeRequest;

class EmployeeRequestController extends Controller
{
    private $employeeRequestService;

    public function __construct()
    {
        $this->employeeRequestService = new EmployeeRequestService;
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

            $employeeRequests = $this->employeeRequestService->getAll($validated);

            return response()->json([
                'success' => true,
                'data' => $employeeRequests->items(),
                'meta' => [
                    'current_page' => $employeeRequests->currentPage(),
                    'last_page' => $employeeRequests->lastPage(),
                    'per_page' => $employeeRequests->perPage(),
                    'total' => $employeeRequests->total(),
                    'from' => $employeeRequests->firstItem(),
                    'to' => $employeeRequests->lastItem(),
                ]
            ]);
        } catch (Exception $e) {
            Log::error("Error al obtener solicitudes de empleado: ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las solicitudes',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function store(StoreEmployeeRequest $request)
    {
        try {
            $this->employeeRequestService->store($request);

            return response()->json([
                'success' => true,
                'message' => 'Solicitud creada exitosamente'
            ], 201);
        } catch (Exception $e) {

            Log::error("Error al crear solicitud de empleado: ", ['message' => $e->getMessage(), 'line' => $e->getLine()]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la solicitud',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
