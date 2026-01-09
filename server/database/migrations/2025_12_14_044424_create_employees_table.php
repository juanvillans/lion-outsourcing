<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_request_id');
            $table->string('email');
            $table->string('fullname');
            $table->string('phone_number');
            $table->foreignId('industry_id')->nullable();
            $table->foreignId('area_id')->nullable();
            $table->string('academic_title')->nullable();
            $table->enum('english_level', ['none', 'beginner', 'intermediate', 'advanced']);
            $table->string('linkedin_url')->nullable();
            $table->string('website_url')->nullable();
            $table->string('localization');
            $table->string('years_of_experience');
            $table->integer('desired_monthly_income');
            $table->string('cv');
            $table->string('photo')->nullable();
            $table->json('skills')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
