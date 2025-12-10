<?php

namespace App\Services;

use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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

        $validated['password'] = Hash::make($validated['password']);

        $employeeRequest = EmployeeRequest::create($validated);

        return $employeeRequest;
    }

    private function applyFilters($query, array $params): void
    {
        if (!empty($params['search'])) {
            $searchTerm = $params['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('fullname', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('phone_number', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('localization', 'LIKE', "%{$searchTerm}%");
            });
        }

        if (!empty($params['status'])) {
            $query->where('status', $params['status']);
        }

        if (!empty($params['industry_id'])) {
            $query->where('industry_id', $params['industry_id']);
        }

        //
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

    /**
     * Aplicar ordenamiento a la consulta
     */
    private function applySorting($query, array $params): void
    {
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortDirection = $params['sort_direction'] ?? 'desc';

        $allowedSortColumns = ['created_at', 'fullname', 'desired_monthly_income', 'status'];

        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }
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
            $file->storeAs('employee_requests/cvs', $fileName, 'public');
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
        $image = $image->resize(800, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // Comprimir a JPG calidad 70%
        $encoded = $image->toJpeg(70);

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
}
