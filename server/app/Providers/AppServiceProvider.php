<?php

namespace App\Providers;

use App\Models\Area;
use App\Models\Employee;
use App\Models\Industry;
use App\Observers\AreaObserver;
use App\Observers\EmployeeObserver;
use App\Observers\IndustryObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Employee::observe(EmployeeObserver::class);
        Area::observe(AreaObserver::class);
        Industry::observe(IndustryObserver::class);
    }
}
