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
        Schema::table('route_points', function (Blueprint $table) {
            // Удаляем старые поля
            $table->dropColumn(['name', 'description', 'latitude', 'longitude', 'order']);
            
            // Добавляем полиморфные поля
            $table->string('target_type')->after('route_id');
            $table->unsignedBigInteger('target_id')->after('target_type');
            $table->integer('order_index')->default(0)->after('target_id');
            $table->text('notes')->nullable()->after('order_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('route_points', function (Blueprint $table) {
            // Возвращаем старые поля
            $table->dropColumn(['target_type', 'target_id', 'order_index', 'notes']);
            
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('order')->default(0);
        });
    }
};
