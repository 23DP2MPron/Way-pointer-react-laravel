<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Place;
use App\Models\Institution;
use Illuminate\Support\Facades\DB;

class AddImageUrlsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Обновляем Places с реальными фотографиями из Wikimedia Commons
        $placesImages = [
            'Eiffel Tower' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg',
            'Central Park' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Central_Park_New_York_City_New_York_10.jpg/800px-Central_Park_New_York_City_New_York_10.jpg',
            'Colosseum' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg',
            'Big Ben' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/800px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg',
            'Riga Old Town' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Riga_old_town_panorama.jpg/800px-Riga_old_town_panorama.jpg',
        ];

        foreach ($placesImages as $name => $url) {
            Place::where('name', $name)->update(['image_url' => $url]);
        }

        // Обновляем Institutions с реальными фотографиями
        $institutionsImages = [
            'Louvre Museum' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/800px-Louvre_Museum_Wikimedia_Commons.jpg',
            'British Museum' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/British_Museum_from_NE_2.JPG/800px-British_Museum_from_NE_2.JPG',
            'Metropolitan Museum of Art' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg/800px-Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg',
            'The Ritz Paris' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Hotel_Ritz%2C_Paris_2010.jpg/800px-Hotel_Ritz%2C_Paris_2010.jpg',
            'Burj Al Arab' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Burj_Al_Arab%2C_Dubai%2C_by_Joi_Ito_Dec2007.jpg/800px-Burj_Al_Arab%2C_Dubai%2C_by_Joi_Ito_Dec2007.jpg',
            'Café de Flore' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cafe_de_Flore%2C_Paris_2010.jpg/800px-Cafe_de_Flore%2C_Paris_2010.jpg',
        ];

        foreach ($institutionsImages as $name => $url) {
            Institution::where('name', $name)->update(['image_url' => $url]);
        }
        
        echo "Updated " . count($placesImages) . " places and " . count($institutionsImages) . " institutions with image URLs\n";
    }
}
