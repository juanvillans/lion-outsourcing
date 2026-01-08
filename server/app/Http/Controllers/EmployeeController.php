<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateEmployeeRequest;
use Exception;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Services\EmployeeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use League\Config\Exception\ValidationException;

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
                'industry_id' => 'nullable|exists:industries,id',
                'area_id' => 'nullable|exists:areas,id',
                'english_level' => 'nullable|in:none,beginner,intermediate,advanced',
                'sort_by' => 'nullable|in:created_at,fullname,desired_monthly_income,status',
                'sort_direction' => 'nullable|in:asc,desc',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date|after_or_equal:date_from',
                'salary_min' => 'nullable|integer|min:0',
                'salary_max' => 'nullable|integer|min:0',
                'experience_min' => 'nullable|integer|min:0',
                'experience_max' => 'nullable|integer|min:0',
                'skills' => 'nullable|string',
                'new_skills' => 'nullable|string',
                'required_skills' => 'nullable|string',
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

    // public function getStats(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'search' => 'nullable|string|max:255',
    //             'status' => 'nullable|in:pending,accepted,rejected',
    //             'industry_id' => 'nullable|exists:industries,id',
    //             'area_id' => 'nullable|exists:areas,id',
    //             'english_level' => 'nullable|in:none,beginner,intermediate,advanced',
    //             'date_from' => 'nullable|date',
    //             'date_to' => 'nullable|date|after_or_equal:date_from',
    //             'salary_min' => 'nullable|integer|min:0',
    //             'salary_max' => 'nullable|integer|min:0',
    //             'experience_min' => 'nullable|integer|min:0',
    //             'experience_max' => 'nullable|integer|min:0',
    //             'skills' => 'nullable|string',
    //             'new_skills' => 'nullable|string',
    //             'required_skills' => 'nullable|string',
    //         ]);

    //         $stats = $this->employeeService->getCountsByFilters($validated);

    //         return response()->json([
    //             'success' => true,
    //             'data' => $stats,
    //         ]);
    //     } catch (Exception $e) {
    //         Log::error("Error al obtener estadísticas: ", [
    //             'message' => $e->getMessage(),
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error al obtener estadísticas',
    //             'error' => config('app.debug') ? $e->getMessage() : null,
    //         ], 500);
    //     }
    // }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {

        try {

            $employee = $this->employeeService->update($request->validated(), $employee);

            return response()->json([
                'success' => true,
                'message' => 'Empleado actualizado exitosamente',
                'data' => $employee,

            ]);
        } catch (Exception $e) {

            Log::error("Error al actualizar empleados ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar empleado',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function updateCV(Request $request, Employee $employee)
    {
        try {

            $request->validate([
                'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            ]);

            $employee = $this->employeeService->updateCV($request->toArray(), $employee);

            return response()->json([
                'success' => true,
                'message' => 'CV del Empleado actualizado exitosamente',
                'data' => $employee,

            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {

            Log::error("Error al actualizar cv del empleado ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar cv del empleado',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function updatePhoto(Request $request, Employee $employee)
    {
        try {

            $request->validate([
                'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'],
            ]);

            $employee = $this->employeeService->updatePhoto($request->validated(), $employee);

            return response()->json([
                'success' => true,
                'message' => 'Foto del Empleado actualizado exitosamente',
                'data' => $employee,

            ]);
        } catch (ValidationException $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {

            Log::error("Error al actualizar foto del empleado ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar foto del empleado',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }


    public function updateSkill(Request $request, Employee $employee)
    {

        try {

            $request->validate([
                'skills' => 'array|required'
            ]);

            $employee->update(['skills' => $request->skills]);


            return response()->json([
                'success' => true,
                'message' => 'Empleado actualizado exitosamente',
                'data' => $employee,

            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar empleado',
                'error' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {

            Log::error("Error al actualizar empleados ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar empleado',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function show(Employee $employee)
    {
        try {

            $employee->load(['industry', 'area']);

            $employee->photo_url = $this->employeeService->getFileUrl($employee->photo);

            $cvUrls = $this->employeeService->getCvUrls($employee);

            if ($cvUrls) {
                $employee->cv_view_url = $cvUrls['view'];
                $employee->cv_download_url = $cvUrls['download'];
            } else {
                $employee->cv_view_url = null;
                $employee->cv_download_url = null;
            }



            return response()->json([
                'success' => true,
                'data' => $employee,
            ]);
        } catch (Exception $e) {

            Log::error("Error al obtener empleado: ", [
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el empleado',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

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

    public function viewCv(Employee $employee)
    {
        return $this->serveFile($employee, false); // is just for preview
    }

    public function downloadCv(Employee $employee)
    {
        return $this->serveFile($employee, true); // is for download
    }

    private function serveFile(Employee $employee, bool $forceDownload = false)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }


        if (!$employee->cv || !Storage::disk('private')->exists($employee->cv)) {
            return response()->json(['error' => 'CV no disponible'], 404);
        }

        $disposition = $forceDownload ? 'attachment' : 'inline';

        $fileName = 'CV_' . $employee->name . '_' . $employee->id .
            '.' . pathinfo($employee->cv, PATHINFO_EXTENSION);

        $headers = [
            'Content-Type' => Storage::disk('private')->mimeType($employee->cv),
            'Content-Disposition' => $disposition . '; filename="' . $fileName . '"',
        ];

        return Storage::disk('private')->response($employee->cv, $fileName, $headers);
    }
}
