<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Place;
use Illuminate\Support\Facades\DB;

class RemoveDuplicatePlaces extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'places:remove-duplicates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove duplicate places from database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Finding duplicate places...');
        
        // Находим дубликаты
        $duplicates = DB::select("
            SELECT name, city, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM places 
            GROUP BY name, city 
            HAVING count > 1
        ");
        
        if (empty($duplicates)) {
            $this->info('No duplicates found!');
            return 0;
        }
        
        $this->info('Found ' . count($duplicates) . ' duplicate groups');
        
        $totalDeleted = 0;
        
        foreach ($duplicates as $duplicate) {
            $ids = explode(',', $duplicate->ids);
            $keepId = $ids[0]; // Оставляем первую запись
            $deleteIds = array_slice($ids, 1); // Удаляем остальные
            
            $this->line("Place: {$duplicate->name} ({$duplicate->city}) - keeping ID {$keepId}, deleting " . count($deleteIds) . " duplicates");
            
            Place::whereIn('id', $deleteIds)->delete();
            $totalDeleted += count($deleteIds);
        }
        
        $this->info("Deleted {$totalDeleted} duplicate places");
        $this->info('Total places now: ' . Place::count());
        
        return 0;
    }
}
