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
        Schema::create('employee_requests', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('fullname');
            $table->string('password');
            $table->string('phone_number');
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->foreignId('industry_id');
            $table->foreignId('area_id');
            $table->string('academic_title')->nullable();
            $table->enum('english_level', ['none', 'beginner', 'intermediate', 'advanced']);
            $table->string('linkedin_url')->nullable();
            $table->string('website_url')->nullable();
            $table->string('localization');
            $table->integer('desired_monthly_income');
            $table->string('cv');
            $table->string('photo')->nullable();
            $table->json('skills');
            $table->json('new_skills');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_requests');
    }
};
