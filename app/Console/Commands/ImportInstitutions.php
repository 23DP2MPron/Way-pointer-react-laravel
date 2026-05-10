<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Institution;
use Illuminate\Support\Facades\Http;

class ImportInstitutions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'institutions:import {--limit=100}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import institutions (museums, universities, etc.) from OpenTripMap API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apiKey = env('OPENTRIPMAP_API_KEY');
        
        if (!$apiKey || $apiKey === 'your_opentripmap_key_here') {
            $this->error('OpenTripMap API key not configured. Please set OPENTRIPMAP_API_KEY in .env file.');
            return 1;
        }

        $limit = $this->option('limit');
        
        // Популярные города для импорта учреждений
        $cities = [
            ['name' => 'Paris', 'country' => 'France', 'lat' => 48.8566, 'lon' => 2.3522],
            ['name' => 'London', 'country' => 'United Kingdom', 'lat' => 51.5074, 'lon' => -0.1278],
            ['name' => 'New York', 'country' => 'United States', 'lat' => 40.7128, 'lon' => -74.0060],
            ['name' => 'Rome', 'country' => 'Italy', 'lat' => 41.9028, 'lon' => 12.4964],
            ['name' => 'Tokyo', 'country' => 'Japan', 'lat' => 35.6762, 'lon' => 139.6503],
            ['name' => 'Barcelona', 'country' => 'Spain', 'lat' => 41.3851, 'lon' => 2.1734],
            ['name' => 'Amsterdam', 'country' => 'Netherlands', 'lat' => 52.3676, 'lon' => 4.9041],
            ['name' => 'Berlin', 'country' => 'Germany', 'lat' => 52.5200, 'lon' => 13.4050],
            ['name' => 'Riga', 'country' => 'Latvia', 'lat' => 56.9496, 'lon' => 24.1052],
            ['name' => 'Prague', 'country' => 'Czech Republic', 'lat' => 50.0755, 'lon' => 14.4378],
        ];

        $this->info('Starting to import institutions...');
        $imported = 0;
        $skipped = 0;

        foreach ($cities as $city) {
            $this->info("Fetching institutions for {$city['name']}, {$city['country']}...");
            
            try {
                // Получаем учреждения из OpenTripMap (музеи, университеты, библиотеки и т.д.)
                $response = Http::get("https://api.opentripmap.com/0.1/en/places/radius", [
                    'apikey' => $apiKey,
                    'radius' => 10000, // 10 км радиус
                    'lon' => $city['lon'],
                    'lat' => $city['lat'],
                    'limit' => 100,
                    'format' => 'json',
                    'kinds' => 'museums,theatres,cinemas,sport,banks,universities'
                ]);

                if ($response->successful()) {
                    $institutions = $response->json();
                    
                    foreach ($institutions as $institution) {
                        if (!isset($institution['name']) || empty($institution['name'])) {
                            continue;
                        }

                        // Проверяем, не существует ли уже
                        $exists = Institution::where('name', $institution['name'])
                            ->where('city', $city['name'])
                            ->exists();

                        if ($exists) {
                            $skipped++;
                            continue;
                        }

                        // Получаем детальную информацию
                        $detailsResponse = Http::get("https://api.opentripmap.com/0.1/en/places/xid/{$institution['xid']}", [
                            'apikey' => $apiKey
                        ]);

                        $details = $detailsResponse->successful() ? $detailsResponse->json() : [];

                        Institution::create([
                            'name' => $institution['name'],
                            'description' => $details['wikipedia_extracts']['text'] ?? $details['info']['descr'] ?? 'No description available',
                            'city' => $city['name'],
                            'country' => $city['country'],
                            'latitude' => $institution['point']['lat'] ?? $city['lat'],
                            'longitude' => $institution['point']['lon'] ?? $city['lon'],
                            'category' => $institution['kinds'] ?? 'institution',
                            'image_url' => $details['preview']['source'] ?? null,
                            'rating' => 0,
                        ]);

                        $imported++;
                        
                        if ($imported >= $limit) {
                            break 2;
                        }

                        // Небольшая задержка, чтобы не превысить лимит API
                        usleep(200000); // 0.2 секунды
                    }
                }
            } catch (\Exception $e) {
                $this->error("Error fetching institutions for {$city['name']}: {$e->getMessage()}");
            }
        }

        $this->info("Import completed!");
        $this->info("Imported: {$imported} institutions");
        $this->info("Skipped: {$skipped} duplicates");

        return 0;
    }
}
