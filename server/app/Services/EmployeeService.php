<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Str;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{

    public function getAll(array $params = [])
    {
        $query = Employee::with(['industry', 'area']);

        $this->applyAllFilters($query, $params);

        if (!empty($params['search'])) {
            $this->applySearch($query, $params['search']);
        }

        $this->applySorting($query, $params);

        return $this->applyPagination($query, $params);
    }

    private function applyAllFilters($query, $params): void
    {
        // Filtros básicos
        $filters = [
            'industry_id' => 'industry_id',
            'area_id' => 'area_id',
            'english_level' => 'english_level',
        ];

        foreach ($filters as $param => $column) {
            if (!empty($params[$param])) {
                $query->where($column, $params[$param]);
            }
        }

        // Filtros por rango de fecha
        if (!empty($params['date_from'])) {
            $query->whereDate('created_at', '>=', $params['date_from']);
        }

        if (!empty($params['date_to'])) {
            $query->whereDate('created_at', '<=', $params['date_to']);
        }

        // Filtro por rango de salario
        if (!empty($params['salary_min'])) {
            $query->where('desired_monthly_income', '>=', $params['salary_min']);
        }

        if (!empty($params['salary_max'])) {
            $query->where('desired_monthly_income', '<=', $params['salary_max']);
        }

        // Filtro por años de experiencia
        if (!empty($params['experience_min'])) {
            $query->where('years_of_experience', '>=', $params['experience_min']);
        }

        if (!empty($params['experience_max'])) {
            $query->where('years_of_experience', '<=', $params['experience_max']);
        }

        // Filtros específicos de skills (JSON fields)
        $this->applyJsonFilters($query, $params);
    }

    private function applyJsonFilters($query, $params): void
    {
        // Filtro por skills (array/coma separado)
        if (!empty($params['skills'])) {
            $skills = is_array($params['skills'])
                ? $params['skills']
                : array_filter(explode(',', $params['skills']));

            if (!empty($skills)) {
                $query->where(function ($q) use ($skills) {
                    foreach ($skills as $skill) {
                        $skill = trim($skill);
                        if (!empty($skill)) {
                            // Búsqueda en campo JSON para MySQL
                            $q->orWhere('skills', 'LIKE', '%"' . $skill . '"%');
                        }
                    }
                });
            }
        }

        // Filtro por new_skills (array/coma separado)
        if (!empty($params['new_skills'])) {
            $newSkills = is_array($params['new_skills'])
                ? $params['new_skills']
                : array_filter(explode(',', $params['new_skills']));

            if (!empty($newSkills)) {
                $query->where(function ($q) use ($newSkills) {
                    foreach ($newSkills as $skill) {
                        $skill = trim($skill);
                        if (!empty($skill)) {
                            // Búsqueda en campo JSON para MySQL
                            $q->orWhere('new_skills', 'LIKE', '%"' . $skill . '"%');
                        }
                    }
                });
            }
        }

        // Filtro que requiera que tenga TODAS las skills especificadas
        if (!empty($params['required_skills'])) {
            $requiredSkills = is_array($params['required_skills'])
                ? $params['required_skills']
                : array_filter(explode(',', $params['required_skills']));

            if (!empty($requiredSkills)) {
                foreach ($requiredSkills as $skill) {
                    $skill = trim($skill);
                    if (!empty($skill)) {
                        $query->where('skills', 'LIKE', '%"' . $skill . '"%');
                    }
                }
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

                // Búsqueda en campos JSON (skills y new_skills)
                $this->searchInJsonFields($q, $term);
            }
        });
    }

    private function searchInTextFields($query, string $term): void
    {
        $textFields = [
            'fullname',
            'email',
            'phone_number',
            'academic_title',
            'localization',
            'linkedin_url',
            'website_url',
        ];

        foreach ($textFields as $field) {
            $query->orWhere($field, 'LIKE', "%{$term}%");
        }
    }

    private function searchInJsonFields($query, string $term): void
    {
        // Para MySQL/MariaDB
        $query->orWhere(function ($q) use ($term) {
            // Búsqueda en skills (JSON array)
            $q->where('skills', 'LIKE', '%"' . $term . '"%')
                ->orWhere('skills', 'LIKE', '%' . $term . '%');

            // Búsqueda en new_skills (JSON array)
            $q->orWhere('new_skills', 'LIKE', '%"' . $term . '"%')
                ->orWhere('new_skills', 'LIKE', '%' . $term . '%');
        });
    }

    private function applySorting($query, $params): void
    {
        $sortBy = $params['sort_by'] ?? 'created_at';
        $sortDirection = $params['sort_direction'] ?? 'desc';

        // Si es búsqueda, ordenar por relevancia primero
        if (!empty($params['search'])) {
            // Para MySQL podemos usar orden por relevancia simple
            // Buscando coincidencias exactas primero
            $searchTerm = trim($params['search']);
            $query->orderByRaw(
                "CASE
                    WHEN fullname LIKE ? THEN 1
                    WHEN email LIKE ? THEN 2
                    WHEN skills LIKE ? THEN 3
                    WHEN new_skills LIKE ? THEN 4
                    ELSE 5
                END",
                [
                    "%{$searchTerm}%",
                    "%{$searchTerm}%",
                    "%\"{$searchTerm}\"%",
                    "%\"{$searchTerm}\"%"
                ]
            );
        }

        // Luego aplicar el orden específico
        $query->orderBy($sortBy, $sortDirection);
    }

    private function applyPagination($query, $params)
    {
        $perPage = $params['per_page'] ?? 15;
        $page = $params['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function destroy(Employee $employee)
    {

        $this->deleteEmployeeFiles($employee);
        $employee->delete(); // Se ejecuta un observer para eliminar la solicitud del empleado

        return 0;
    }

    private function deleteEmployeeFiles(Employee $employee): void
    {
        try {
            if ($employee->cv && Storage::disk('private')->exists($employee->cv)) {
                Storage::disk('private')->delete($employee->cv);
                Log::info('CV del empleado eliminado', ['path' => $employee->cv]);
            }

            if ($employee->photo && Storage::disk('public')->exists($employee->photo)) {
                Storage::disk('public')->delete($employee->photo);
                Log::info('Foto del empleado eliminada', ['path' => $employee->photo]);
            }
        } catch (\Exception $e) {
            Log::warning('Error al eliminar archivos del empleado, continuando...', [
                'employee_id' => $employee->id,
                'error' => $e->getMessage()
            ]);
        }
    }


    public function storeFromRequest(EmployeeRequest $employeeRequest)
    {
        try {

            $newPaths = $this->moveEmployeeFiles($employeeRequest);

            $employeeData = $employeeRequest->toArray();

            $employeeRequestId = $employeeData['id'];

            $employeeData['employee_request_id'] = $employeeRequestId;
            $employeeData['cv'] = $newPaths['cv'] ?? null;
            $employeeData['photo'] = $newPaths['photo'] ?? null;

            // Quitar datos innecesarios para employee
            unset($employeeData['id'], $employeeData['status'], $employeeData['created_at'], $employeeData['updated_at']);

            $employee = Employee::create($employeeData);

            Log::info('Employee creado desde EmployeeRequest', [
                'employee_request_id' => $employeeRequest->id,
                'employee_id' => $employee->id,
            ]);

            return $employee;
        } catch (\Exception $e) {
            Log::error('Error al crear Employee desde EmployeeRequest', [
                'employee_request_id' => $employeeRequest->id,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    private function moveEmployeeFiles(EmployeeRequest $employeeRequest): array
    {
        $newPaths = [
            'cv' => $employeeRequest->cv,
            'photo' => $employeeRequest->photo
        ];

        if ($employeeRequest->cv) {
            $newPaths['cv'] = $this->movePrivateFileAndUpdatePath(
                $employeeRequest->cv,
                'employees/cvs'
            );
        }

        if ($employeeRequest->photo) {
            $newPaths['photo'] = $this->moveFileAndUpdatePath(
                $employeeRequest->photo,
                'employees/photos'
            );
        }

        return $newPaths;
    }

    private function moveFileAndUpdatePath(string $oldFullPath, string $newBaseFolder): string
    {


        if (!Storage::disk('public')->exists($oldFullPath)) {
            throw new \Exception("Archivo no encontrado: {$oldFullPath}");
        }

        $extension = pathinfo(basename($oldFullPath), PATHINFO_EXTENSION);
        $newFilename = Str::uuid() . '.' . $extension;

        $newFullPath = $newBaseFolder . '/' . $newFilename;

        if (!Storage::disk('public')->exists($newBaseFolder)) {
            Storage::disk('public')->makeDirectory($newBaseFolder, 0755, true);
        }

        // Mover archivo (copiar y eliminar)
        Storage::disk('public')->copy($oldFullPath, $newFullPath);
        Storage::disk('public')->delete($oldFullPath);

        return $newFullPath;
    }

    private function movePrivateFileAndUpdatePath(string $oldFullPath, string $newBaseFolder): string
    {
        $oldFilename = basename($oldFullPath);

        if (!Storage::disk('private')->exists($oldFullPath)) {
            throw new \Exception("Archivo privado no encontrado: {$oldFullPath}");
        }

        $extension = pathinfo($oldFilename, PATHINFO_EXTENSION);
        $newFilename = Str::uuid() . '.' . $extension;
        $newFullPath = $newBaseFolder . '/' . $newFilename;

        if (!Storage::disk('private')->exists($newBaseFolder)) {
            Storage::disk('private')->makeDirectory($newBaseFolder, 0755, true);
        }

        // Mover archivo privado
        $fileContents = Storage::disk('private')->get($oldFullPath);
        Storage::disk('private')->put($newFullPath, $fileContents);
        Storage::disk('private')->delete($oldFullPath);

        return $newFullPath;
    }

    public function getFileUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    public function getCvUrls(Employee $employee)
    {
        if (!$employee->cv) {
            return null;
        }

        if (!auth()->check()) {
            return null;
        }

        return [
            'view' => route('employee.cv.view', $employee),
            'download' => route('employee.cv.download', $employee),
        ];
    }
}
