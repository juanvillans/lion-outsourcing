<?php

namespace App\Observers;

use App\Models\Employee;
use App\Models\Industry;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;

class IndustryObserver
{
    public function deleted(Industry $industry): void
    {
        try {

            Employee::where('industry_id', $industry->id)->update(['industry_id' => null]);
            EmployeeRequest::where('industry_id', $industry->id)->update(['industry_id' => null]);


            Log::info('Tablas de empleados y solicitudes actualizadas el industry por observer ', [
                'industry' => $industry,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en observer al actualizar el industry en la tabla de empleados y solicitudes', [
                'industry' => $industry,
                'error' => $e->getMessage()
            ]);
        }
    }
}
