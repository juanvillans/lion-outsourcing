<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Services\EmailService;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\CheckEmailRequest;
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
                'status' => 'nullable|in:pending,rejected',
                'industry_id' => 'nullable|exists:industries,id',
                'area_id' => 'nullable|exists:areas,id',
                'english_level' => 'nullable|in:none,beginner,intermediate,advanced',
                'sort_by' => 'nullable|in:created_at,fullname,desired_monthly_income,status',
                'sort_direction' => 'nullable|in:asc,desc',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date|after_or_equal:date_from',
                'skills' => 'nullable'
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

    public function checkEmail(CheckEmailRequest $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Correo electrónico disponible',
            'available' => true
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        try {

            $employeeRequest = $this->employeeRequestService->store($request);

            $employeeRequest->load(['industry', 'area']);

            $mailjetService = new EmailService;
            $mailjetService->sendEmailToNotifyAdminForNewEmployeeRequest($employeeRequest);

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

    public function show(EmployeeRequest $employeeRequest)
    {
        try {

            $employeeRequest->load(['industry', 'area']);

            $employeeRequest->photo_url = $this->employeeRequestService
                ->getFileUrl($employeeRequest->photo);

            $cvUrls = $this->employeeRequestService->getCvUrls($employeeRequest);

            if ($cvUrls) {
                $employeeRequest->cv_view_url = $cvUrls['view'];
                $employeeRequest->cv_download_url = $cvUrls['download'];
            } else {
                $employeeRequest->cv_view_url = null;
                $employeeRequest->cv_download_url = null;
            }



            return response()->json([
                'success' => true,
                'data' => $employeeRequest,
            ]);
        } catch (Exception $e) {

            Log::error("Error al obtener solicitude de empleado: ", [
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

    public function updateStatus(Request $request, EmployeeRequest $employeeRequest)
    {

        try {

            DB::beginTransaction();

            $validated = $request->validate([
                'status' => 'required|in:pending,accepted,rejected',
            ]);

            $updated = $this->employeeRequestService->updateStatus($employeeRequest, $validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $updated,
                'message' => 'Estado actualizado exitosamente'
            ]);
        } catch (Exception $e) {
            Log::error("Error al actualizar estado de la solicitud: ", ['message' => $e->getMessage(), 'line' => $e->getLine()]);

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estado de la solicitud',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }


    public function viewCv(EmployeeRequest $employeeRequest)
    {
        return $this->serveFile($employeeRequest, false); // is just for preview
    }

    public function downloadCv(EmployeeRequest $employeeRequest)
    {
        return $this->serveFile($employeeRequest, true); // is for download
    }

    private function serveFile(EmployeeRequest $employeeRequest, bool $forceDownload = false)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }


        if (!$employeeRequest->cv || !Storage::disk('private')->exists($employeeRequest->cv)) {
            return response()->json(['error' => 'CV no disponible'], 404);
        }

        $disposition = $forceDownload ? 'attachment' : 'inline';

        $fileName = 'CV_' . $employeeRequest->name . '_' . $employeeRequest->id .
            '.' . pathinfo($employeeRequest->cv, PATHINFO_EXTENSION);

        $headers = [
            'Content-Type' => Storage::disk('private')->mimeType($employeeRequest->cv),
            'Content-Disposition' => $disposition . '; filename="' . $fileName . '"',
        ];

        return Storage::disk('private')->response($employeeRequest->cv, $fileName, $headers);
    }
}
