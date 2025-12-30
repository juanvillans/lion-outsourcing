<?php

namespace App\Observers;

use App\Models\Area;
use App\Models\Employee;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;

class AreaObserver
{
    public function deleted(Area $area): void
    {
        try {

            Employee::where('area_id', $area->id)->update(['area_id' => null]);
            EmployeeRequest::where('area_id', $area->id)->update(['area_id' => null]);


            Log::info('Tablas de empleados y solicitudes actualizadas el area por observer ', [
                'area' => $area,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en observer al actualizar el area en la tabla de empleados y solicitudes', [
                'area' => $area,
                'error' => $e->getMessage()
            ]);
        }
    }
}
