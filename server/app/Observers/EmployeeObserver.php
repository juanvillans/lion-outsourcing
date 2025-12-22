<?php

namespace App\Observers;

use App\Models\Employee;
use App\Models\EmployeeRequest;
use Illuminate\Support\Facades\Log;

class EmployeeObserver
{
    /**
     * Handle the Employee "created" event.
     */
    public function created(Employee $employee): void
    {
        //
    }

    /**
     * Handle the Employee "updated" event.
     */
    public function updated(Employee $employee): void
    {
        //
    }

    /**
     * Handle the Employee "deleted" event.
     */
    public function deleted(Employee $employee): void
    {
        try {

            if ($employee->employee_request_id) {
                $employeeRequest = EmployeeRequest::find($employee->employee_request_id);

                if ($employeeRequest) {
                    $employeeRequest->delete();
                }
            }

            Log::info('Solicitud de empleado eliminado por observer ', [
                'employee_id' => $employee->id,
                'employee_request_id' => $employee->employee_request_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en observer al eliminar solicitud del empleado', [
                'employee_id' => $employee->id,
                'error' => $e->getMessage()
            ]);
        }
    }



    /**
     * Handle the Employee "restored" event.
     */
    public function restored(Employee $employee): void
    {
        //
    }

    /**
     * Handle the Employee "force deleted" event.
     */
    public function forceDeleted(Employee $employee): void
    {
        //
    }

    public function deleting(Employee $employee): void {}
}
