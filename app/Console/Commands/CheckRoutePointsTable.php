<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CheckRoutePointsTable extends Command
{
    protected $signature = 'check:route-points';
    protected $description = 'Check route_points table structure and data';

    public function handle()
    {
        $this->info('Checking route_points table...');
        
        // Проверяем существование таблицы
        if (!Schema::hasTable('route_points')) {
            $this->error('Table route_points does not exist!');
            return 1;
        }
        
        $this->info('✓ Table route_points exists');
        
        // Проверяем колонки
        $columns = Schema::getColumnListing('route_points');
        $this->info('Columns: ' . implode(', ', $columns));
        
        $requiredColumns = ['id', 'route_id', 'target_type', 'target_id', 'order_index', 'notes'];
        foreach ($requiredColumns as $col) {
            if (in_array($col, $columns)) {
                $this->info("✓ Column '$col' exists");
            } else {
                $this->error("✗ Column '$col' is missing!");
            }
        }
        
        // Проверяем данные
        $count = DB::table('route_points')->count();
        $this->info("Total route points in database: $count");
        
        if ($count > 0) {
            $this->info('Sample data:');
            $samples = DB::table('route_points')->limit(3)->get();
            foreach ($samples as $sample) {
                $this->line(json_encode($sample, JSON_PRETTY_PRINT));
            }
        }
        
        return 0;
    }
}
