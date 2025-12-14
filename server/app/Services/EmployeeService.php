<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Str;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EmployeeService
{

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

    /**
     * Método para archivos privados (si los CVs están en private)
     */
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
}
