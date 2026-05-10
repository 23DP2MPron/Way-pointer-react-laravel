<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Institution;
use Illuminate\Support\Facades\DB;

class RemoveDuplicateInstitutions extends Command
{
    protected $signature = 'institutions:remove-duplicates';
    protected $description = 'Remove duplicate institutions from database';

    public function handle()
    {
        $this->info('Finding duplicate institutions...');
        
        $duplicates = DB::select("
            SELECT name, city, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM institutions 
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
            $keepId = $ids[0];
            $deleteIds = array_slice($ids, 1);
            
            $this->line("Institution: {$duplicate->name} ({$duplicate->city}) - keeping ID {$keepId}, deleting " . count($deleteIds) . " duplicates");
            
            Institution::whereIn('id', $deleteIds)->delete();
            $totalDeleted += count($deleteIds);
        }
        
        $this->info("Deleted {$totalDeleted} duplicate institutions");
        $this->info('Total institutions now: ' . Institution::count());
        
        return 0;
    }
}
