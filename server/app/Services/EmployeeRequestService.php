<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use App\Enums\EmployeeRequestStatusEnum;
use Intervention\Image\Drivers\Gd\Driver;
use App\Http\Requests\StoreEmployeeRequest;

class EmployeeRequestService
{
    public function getAll(array $params = [])
    {
        $defaultParams = [
            'page' => 1,
            'per_page' => 20,
            'sort_by' => 'created_at',
            'sort_direction' => 'desc',
        ];

        $params = array_merge($defaultParams, $params);

        $query = EmployeeRequest::query();

        $query->whereNot('status', EmployeeRequestStatusEnum::Accepted->value);

        $this->applyFilters($query, $params);

        $this->applySorting($query, $params);

        $query->with(['industry', 'area']);

        $perPage = max(1, min(100, (int)$params['per_page']));
        $page = max(1, (int)$params['page']);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function store(StoreEmployeeRequest $request): EmployeeRequest
    {
        $validated = $request->validated();

        $this->handleFiles($validated, $request);

        $employeeRequest = EmployeeRequest::create($validated);

        return $employeeRequest;
    }

    public function updateStatus(EmployeeRequest $employeeRequest, array $data)
    {
        $employeeRequest->status = $data['status'];
        $employeeRequest->save();

        if ($employeeRequest->status == EmployeeRequestStatusEnum::Accepted->value)
            $this->handleAcceptedEmployeeRequest($employeeRequest);
        else
            $employeeRequest = $this->handleRejectedEmployeeRequest($employeeRequest);

        return $employeeRequest;
    }

    private function handleAcceptedEmployeeRequest(EmployeeRequest $employeeRequest)
    {
        $employeeService = new EmployeeService;
        $employee = $employeeService->storeFromRequest($employeeRequest);

        $employeeRequest->cv = $employee->cv;
        $employeeRequest->photo = $employee->photo;

        Log::info("Archivos trasladados exitosamente", ['EmployeeRequestID' => $employeeRequest->id]);

        $mailjetService = new EmailService;
        $mailjetService->sendEmailToNotifyNewEmployee($employeeRequest);
    }

    private function handleRejectedEmployeeRequest(EmployeeRequest $employeeRequest)
    {
        Storage::disk('private')->delete($employeeRequest->cv);

        if (!is_null($employeeRequest->photo))
            Storage::disk('public')->delete($employeeRequest->photo);

        $mailjetService = new EmailService;
        $mailjetService->sendEmailToNotifyRequestDeleted($employeeRequest);

        $employeeRequest->delete();

        return null;
    }

    private function applyFilters($query, array $params): void
    {
        if (!empty($params['skills'])) {
            $this->applyJsonFilters($query, $params);
        }

        if (!empty($params['search'])) {
            $this->applySearch($query, $params['search']);
        }

        if (!empty($params['status'])) {
            $query->where('status', $params['status']);
        }

        if (!empty($params['industry_id'])) {
            $query->where('industry_id', $params['industry_id']);
        }

        if (!empty($params['area_id'])) {
            $query->where('area_id', $params['area_id']);
        }

        if (!empty($params['english_level'])) {
            $query->where('english_level', $params['english_level']);
        }

        if (!empty($params['date_from'])) {
            $query->whereDate('created_at', '>=', $params['date_from']);
        }

        if (!empty($params['date_to'])) {
            $query->whereDate('created_at', '<=', $params['date_to']);
        }

        if (!empty($params['min_income'])) {
            $query->where('desired_monthly_income', '>=', $params['min_income']);
        }

        if (!empty($params['max_income'])) {
            $query->where('desired_monthly_income', '<=', $params['max_income']);
        }
    }

    private function applyJsonFilters($query, $params): void
    {
        if (!empty($params['skills'])) {
            $skills = is_array($params['skills'])
                ? $params['skills']
                : array_filter(explode(',', $params['skills']));

            if (!empty($skills)) {
                $query->where(function ($q) use ($skills) {
                    foreach ($skills as $skill) {
                        $skill = trim($skill);
                        if (!empty($skill)) {
                            $normalizedSkill = $this->normalizeForSearch($skill);

                            $q->orWhere(function ($subQuery) use ($skill, $normalizedSkill) {
                                $subQuery->whereRaw("JSON_SEARCH(skills, 'all', ?) IS NOT NULL", ["%{$skill}%"]);
                                $subQuery->orWhereRaw("JSON_SEARCH(skills, 'all', ?) IS NOT NULL", ["%{$normalizedSkill}%"]);
                            });
                        }
                    }
                });
            }
        }
    }

    private function applySearch($query, string $searchTerm): void
    {
        $searchTerm = trim($searchTerm);
        $searchTerms = array_filter(explode(' ', $searchTerm));

        if (empty($searchTerms)) {
            return;
        }

        $query->where(function ($q) use ($searchTerms) {
            foreach ($searchTerms as $term) {
                $term = trim($term);
                if (strlen($term) < 2) continue;

                // Búsqueda en campos de texto normales
                $this->searchInTextFields($q, $term);

                // Búsqueda en campos JSON (skills)
                $this->searchInJsonFields($q, $term);
            }
        });
    }

    private function searchInTextFields($query, string $term): void
    {
        $textFields = ['fullname', 'email', 'phone_number', 'academic_title', 'localization', 'linkedin_url', 'website_url'];

        $normalizedTerm = $this->normalizeForSearch($term);

        foreach ($textFields as $field) {
            $query->orWhereRaw("LOWER($field) LIKE ?", ["%{$normalizedTerm}%"]);
        }
    }

    private function searchInJsonFields($query, string $term): void
    {
        $normalizedTerm = $this->normalizeForSearch($term);

        $query->orWhere(function ($q) use ($normalizedTerm, $term) {
            $q->whereRaw("JSON_SEARCH(skills, 'all', ?) IS NOT NULL", ["%{$term}%"]);
            $q->orWhereRaw("JSON_SEARCH(skills, 'all', ?) IS NOT NULL", ["%{$normalizedTerm}%"]);
            $q->orWhereRaw(
                "LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(skills, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'), 'ñ', 'n'), 'ü', 'u')) LIKE ?",
                ["%{$normalizedTerm}%"]
            );
        });
    }

    /**
     * Aplicar ordenamiento a la consulta
     */
    private function applySorting($query, array $params): void
    {
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortDirection = $params['sort_direction'] ?? 'desc';

        $allowedSortColumns = ['created_at', 'fullname', 'desired_monthly_income', 'status'];

        if (!empty($params['search'])) {
            $searchTerm = trim($params['search']);
            $normalizedTerm = $this->normalizeForSearch($searchTerm);

            $query->orderByRaw(
                "CASE
                WHEN LOWER(fullname) LIKE ? THEN 1
                WHEN LOWER(email) LIKE ? THEN 2
                WHEN JSON_SEARCH(skills, 'all', ?) IS NOT NULL THEN 3
                ELSE 4
            END",
                [
                    "%{$normalizedTerm}%",
                    "%{$normalizedTerm}%",
                    "%{$normalizedTerm}%"
                ]
            );
        }

        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }
    }

    /**
     * Método auxiliar para normalizar términos de búsqueda
     */
    private function normalizeForSearch(string $text): string
    {
        $text = mb_strtolower($text, 'UTF-8');
        $search = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'];
        $replace = ['a', 'e', 'i', 'o', 'u', 'n', 'u'];
        return str_replace($search, $replace, $text);
    }

    private function handleFiles(array &$data, StoreEmployeeRequest $request): void
    {
        // Crear directorios si no existen
        $this->ensureDirectoriesExist();

        // Generar nombre base único con timestamp
        $timestamp = now()->format('Ymd_His');
        $uniqueId = Str::random(8);
        $baseName = "{$timestamp}_{$uniqueId}";

        // Manejar CV
        if ($request->hasFile('cv')) {
            $data['cv'] = $this->handleCvFile($request->file('cv'), $baseName);
        }

        // Manejar foto
        if ($request->hasFile('photo')) {
            $data['photo'] = $this->handlePhotoFile($request->file('photo'), $baseName);
        }
    }

    /**
     * Crear directorios necesarios
     */
    private function ensureDirectoriesExist(): void
    {
        $directories = [
            'employee_requests',
            'employee_requests/cvs',
            'employee_requests/photos',
        ];

        foreach ($directories as $directory) {
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
            }
        }
    }

    /**
     * Manejar archivo de CV (comprimir si es imagen, mantener formato si es PDF/DOC)
     */
    private function handleCvFile($file, string $baseName): string
    {
        $originalExtension = strtolower($file->getClientOriginalExtension());
        $fileName = "cv_{$baseName}.{$originalExtension}";
        $filePath = "employee_requests/cvs/{$fileName}";

        // Guardar PDF/DOC sin tocar
        if (in_array($originalExtension, ['pdf', 'doc', 'docx'])) {
            $file->storeAs('employee_requests/cvs', $fileName, 'private');
            return $filePath;
        }

        // Si es imagen → procesar
        if (str_starts_with($file->getMimeType(), 'image/')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($file->getPathname());

            // Redimensionar (máx 2000px)
            $image = $image->resize(2000, 2000, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            // Convertir según extensión
            $extension = $originalExtension === 'png' ? 'png' : 'jpg';

            $encoded = $extension === 'png'
                ? $image->toPng(8)   // Compresión PNG
                : $image->toJpeg(75); // 75% calidad JPG

            Storage::disk('public')->put($filePath, $encoded);

            return $filePath;
        }

        // Otros tipos → guardar sin procesar
        $file->storeAs('employee_requests/cvs', $fileName, 'public');
        return $filePath;
    }

    /**
     * Manejar archivo de foto (siempre comprimir)
     */
    private function handlePhotoFile($file, string $baseName): string
    {
        $fileName = "photo_{$baseName}.jpg";
        $filePath = "employee_requests/photos/{$fileName}";

        $manager = new ImageManager(new Driver());
        $image = $manager->read($file->getPathname());

        // Redimensionar a máximo 800px ancho
        $image = $image->resize(800, 800, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Comprimir a JPG calidad 70%
        $encoded = $image->toJpeg(100);

        Storage::disk('public')->put($filePath, $encoded);

        return $filePath;
    }

    /**
     * Eliminar archivos asociados a una solicitud
     */
    public function deleteFiles(EmployeeRequest $employeeRequest): void
    {
        if ($employeeRequest->cv && Storage::disk('public')->exists($employeeRequest->cv)) {
            Storage::disk('public')->delete($employeeRequest->cv);
        }

        if ($employeeRequest->photo && Storage::disk('public')->exists($employeeRequest->photo)) {
            Storage::disk('public')->delete($employeeRequest->photo);
        }
    }

    /**
     * Obtener URL pública de un archivo
     */
    public function getFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    public function getCvUrls(EmployeeRequest $employeeRequest)
    {
        if (!$employeeRequest->cv) {
            return null;
        }

        if (!auth()->check()) {
            return null;
        }

        return [
            'view' => route('employee_requests.cv.view', $employeeRequest),
            'download' => route('employee_requests.cv.download', $employeeRequest),
        ];
    }
}
