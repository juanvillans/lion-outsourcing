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
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('area_secondary_1_id')
            ->nullable()
            ->constrained('areas')
            ->nullOnDelete();

          $table->foreignId('area_secondary_2_id')
            ->nullable()
            ->constrained('areas')
            ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['area_secondary_1_id']);
            $table->dropForeign(['area_secondary_2_id']);

            $table->dropColumn(['area_secondary_1_id', 'area_secondary_2_id']);
        });
    }
};
