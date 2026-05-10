<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Institution;

class FinalInstitutionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institutions = [
            // More Restaurants
            ['name' => 'Per Se', 'description' => 'Thomas Keller\'s New York restaurant', 'category' => 'restaurant', 'address' => '10 Columbus Circle, New York, NY 10019', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7688, 'longitude' => -73.9830, 'rating' => 4.8],
            ['name' => 'Guy Savoy', 'description' => 'Three Michelin star French restaurant', 'category' => 'restaurant', 'address' => 'Monnaie de Paris, 11 Quai de Conti, 75006', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8575, 'longitude' => 2.3397, 'rating' => 4.9],
            ['name' => 'Azurmendi', 'description' => 'Three Michelin star Basque restaurant', 'category' => 'restaurant', 'address' => 'Barrio Leguina, s/n', 'city' => 'Larrabetzu', 'country' => 'Spain', 'latitude' => 43.2333, 'longitude' => -2.8167, 'rating' => 4.8],
            ['name' => 'Maido', 'description' => 'Nikkei cuisine restaurant', 'category' => 'restaurant', 'address' => 'Calle San Martín 399', 'city' => 'Lima', 'country' => 'Peru', 'latitude' => -12.0707, 'longitude' => -77.0343, 'rating' => 4.7],
            ['name' => 'Don Julio', 'description' => 'Traditional Argentine steakhouse', 'category' => 'restaurant', 'address' => 'Guatemala 4699', 'city' => 'Buenos Aires', 'country' => 'Argentina', 'latitude' => -34.5875, 'longitude' => -58.4289, 'rating' => 4.7],
            ['name' => 'Septime', 'description' => 'Contemporary French bistro', 'category' => 'restaurant', 'address' => '80 Rue de Charonne, 75011', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8530, 'longitude' => 2.3825, 'rating' => 4.6],
            ['name' => 'Disfrutar', 'description' => 'Creative Mediterranean cuisine', 'category' => 'restaurant', 'address' => 'Carrer de Villarroel, 163', 'city' => 'Barcelona', 'country' => 'Spain', 'latitude' => 41.3851, 'longitude' => 2.1534, 'rating' => 4.8],
            ['name' => 'Ultraviolet', 'description' => 'Multi-sensory dining experience', 'category' => 'restaurant', 'address' => 'Secret location', 'city' => 'Shanghai', 'country' => 'China', 'latitude' => 31.2304, 'longitude' => 121.4737, 'rating' => 4.9],
            ['name' => 'Dinner by Heston', 'description' => 'Historic British cuisine', 'category' => 'restaurant', 'address' => '66 Knightsbridge, London SW1X 7LA', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5020, 'longitude' => -0.1601, 'rating' => 4.7],
            ['name' => 'Pujol', 'description' => 'Contemporary Mexican cuisine', 'category' => 'restaurant', 'address' => 'Tennyson 133', 'city' => 'Mexico City', 'country' => 'Mexico', 'latitude' => 19.4326, 'longitude' => -99.1932, 'rating' => 4.7],
            
            // More Hotels
            ['name' => 'Aman Venice', 'description' => 'Luxury hotel in 16th-century palazzo', 'category' => 'hotel', 'address' => 'Calle Tiepolo 1364', 'city' => 'Venice', 'country' => 'Italy', 'latitude' => 45.4371, 'longitude' => 12.3319, 'rating' => 4.9],
            ['name' => 'Rosewood London', 'description' => 'Luxury hotel in Edwardian building', 'category' => 'hotel', 'address' => '252 High Holborn, London WC1V 7EN', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5177, 'longitude' => -0.1204, 'rating' => 4.7],
            ['name' => 'Hôtel Le Bristol Paris', 'description' => 'Palace hotel on Rue du Faubourg', 'category' => 'hotel', 'address' => '112 Rue du Faubourg Saint-Honoré, 75008', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8711, 'longitude' => 2.3161, 'rating' => 4.8],
            ['name' => 'The Carlyle', 'description' => 'Iconic Upper East Side hotel', 'category' => 'hotel', 'address' => '35 E 76th St, New York, NY 10021', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7745, 'longitude' => -73.9635, 'rating' => 4.7],
            ['name' => 'Badrutt\'s Palace', 'description' => 'Luxury alpine resort hotel', 'category' => 'hotel', 'address' => 'Via Serlas 27', 'city' => 'St. Moritz', 'country' => 'Switzerland', 'latitude' => 46.4979, 'longitude' => 9.8355, 'rating' => 4.8],
            ['name' => 'Hotel Imperial Vienna', 'description' => 'Historic luxury hotel on Ringstrasse', 'category' => 'hotel', 'address' => 'Kärntner Ring 16', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2014, 'longitude' => 16.3721, 'rating' => 4.7],
            ['name' => 'Taj Mahal Palace', 'description' => 'Iconic heritage hotel', 'category' => 'hotel', 'address' => 'Apollo Bandar, Colaba', 'city' => 'Mumbai', 'country' => 'India', 'latitude' => 18.9220, 'longitude' => 72.8332, 'rating' => 4.7],
            ['name' => 'The Fullerton Hotel', 'description' => 'Heritage hotel in former post office', 'category' => 'hotel', 'address' => '1 Fullerton Square', 'city' => 'Singapore', 'country' => 'Singapore', 'latitude' => 1.2859, 'longitude' => 103.8540, 'rating' => 4.7],
            
            // More Museums
            ['name' => 'MoMA', 'description' => 'Museum of Modern Art', 'category' => 'museum', 'address' => '11 W 53rd St, New York, NY 10019', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7614, 'longitude' => -73.9776, 'rating' => 4.7],
            ['name' => 'Centre Pompidou', 'description' => 'Modern art museum with exposed structure', 'category' => 'museum', 'address' => 'Place Georges-Pompidou, 75004', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8606, 'longitude' => 2.3522, 'rating' => 4.6],
            ['name' => 'Albertina', 'description' => 'Art museum in former Habsburg palace', 'category' => 'museum', 'address' => 'Albertinaplatz 1', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2047, 'longitude' => 16.3684, 'rating' => 4.7],
            ['name' => 'Galleria Borghese', 'description' => 'Art gallery in Villa Borghese', 'category' => 'museum', 'address' => 'Piazzale Scipione Borghese, 5', 'city' => 'Rome', 'country' => 'Italy', 'latitude' => 41.9142, 'longitude' => 12.4922, 'rating' => 4.8],
            ['name' => 'Mori Art Museum', 'description' => 'Contemporary art museum in Roppongi Hills', 'category' => 'museum', 'address' => '6-10-1 Roppongi, Minato City', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6604, 'longitude' => 139.7292, 'rating' => 4.5],
            ['name' => 'Neue Nationalgalerie', 'description' => 'Modern art museum by Mies van der Rohe', 'category' => 'museum', 'address' => 'Potsdamer Str. 50', 'city' => 'Berlin', 'country' => 'Germany', 'latitude' => 52.5095, 'longitude' => 13.3673, 'rating' => 4.6],
            ['name' => 'Museo del Prado Extension', 'description' => 'Extension of Prado Museum', 'category' => 'museum', 'address' => 'Paseo del Prado, s/n', 'city' => 'Madrid', 'country' => 'Spain', 'latitude' => 40.4138, 'longitude' => -3.6921, 'rating' => 4.7],
            ['name' => 'National Palace Museum', 'description' => 'Museum of Chinese imperial artifacts', 'category' => 'museum', 'address' => 'No. 221, Sec 2, Zhi Shan Rd', 'city' => 'Taipei', 'country' => 'Taiwan', 'latitude' => 25.1023, 'longitude' => 121.5485, 'rating' => 4.6],
            
            // More Cafes
            ['name' => 'Café de la Paix', 'description' => 'Historic café near Opera Garnier', 'category' => 'cafe', 'address' => '5 Place de l\'Opéra, 75009', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8708, 'longitude' => 2.3314, 'rating' => 4.3],
            ['name' => 'Café Gerbeaud', 'description' => 'Historic café in Budapest', 'category' => 'cafe', 'address' => 'Vörösmarty tér 7', 'city' => 'Budapest', 'country' => 'Hungary', 'latitude' => 47.4960, 'longitude' => 19.0514, 'rating' => 4.4],
            ['name' => 'Café Slavia', 'description' => 'Historic café with castle views', 'category' => 'cafe', 'address' => 'Smetanovo nábřeží 1012/2', 'city' => 'Prague', 'country' => 'Czech Republic', 'latitude' => 50.0820, 'longitude' => 14.4131, 'rating' => 4.3],
            ['name' => 'Café Savoy', 'description' => 'Neo-Renaissance café in Prague', 'category' => 'cafe', 'address' => 'Vítězná 124/5', 'city' => 'Prague', 'country' => 'Czech Republic', 'latitude' => 50.0820, 'longitude' => 14.4050, 'rating' => 4.5],
            ['name' => 'Café Schwarzenberg', 'description' => 'Traditional Viennese café', 'category' => 'cafe', 'address' => 'Kärntner Ring 17', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2014, 'longitude' => 16.3721, 'rating' => 4.4],
            ['name' => 'Café Demel', 'description' => 'Imperial and Royal Court Confectioner', 'category' => 'cafe', 'address' => 'Kohlmarkt 14', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2088, 'longitude' => 16.3663, 'rating' => 4.5],
            ['name' => 'Café Tomaselli', 'description' => 'Oldest café in Austria', 'category' => 'cafe', 'address' => 'Alter Markt 9', 'city' => 'Salzburg', 'country' => 'Austria', 'latitude' => 47.7995, 'longitude' => 13.0438, 'rating' => 4.4],
            ['name' => 'Café Einstein', 'description' => 'Traditional Viennese-style café', 'category' => 'cafe', 'address' => 'Kurfürstenstraße 58', 'city' => 'Berlin', 'country' => 'Germany', 'latitude' => 52.4987, 'longitude' => 13.3467, 'rating' => 4.4],
            
            // More Bars
            ['name' => 'Paradiso', 'description' => 'Speakeasy bar behind pastrami shop', 'category' => 'bar', 'address' => 'Carrer de Rera Palau, 4', 'city' => 'Barcelona', 'country' => 'Spain', 'latitude' => 41.3851, 'longitude' => 2.1834, 'rating' => 4.7],
            ['name' => 'Attaboy', 'description' => 'Intimate cocktail bar on Lower East Side', 'category' => 'bar', 'address' => '134 Eldridge St, New York, NY 10002', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7209, 'longitude' => -73.9903, 'rating' => 4.6],
            ['name' => 'Nightjar', 'description' => 'Speakeasy-style cocktail bar', 'category' => 'bar', 'address' => '129 City Rd, London EC1V 1JB', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5282, 'longitude' => -0.0899, 'rating' => 4.6],
            ['name' => 'Little Red Door', 'description' => 'Conceptual cocktail bar', 'category' => 'bar', 'address' => '60 Rue Charlot, 75003', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8630, 'longitude' => 2.3630, 'rating' => 4.5],
            ['name' => 'Schumann\'s Bar', 'description' => 'Classic cocktail bar in Munich', 'category' => 'bar', 'address' => 'Odeonsplatz 6-7', 'city' => 'Munich', 'country' => 'Germany', 'latitude' => 48.1426, 'longitude' => 11.5770, 'rating' => 4.5],
            ['name' => 'Tippling Club', 'description' => 'Modern cocktail bar and restaurant', 'category' => 'bar', 'address' => '38 Tanjong Pagar Rd', 'city' => 'Singapore', 'country' => 'Singapore', 'latitude' => 1.2789, 'longitude' => 103.8431, 'rating' => 4.6],
            
            // More Shops
            ['name' => 'Liberty London', 'description' => 'Department store in Tudor Revival building', 'category' => 'shop', 'address' => 'Regent St, London W1B 5AH', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5138, 'longitude' => -0.1406, 'rating' => 4.6],
            ['name' => 'La Rinascente', 'description' => 'Italian department store chain', 'category' => 'shop', 'address' => 'Piazza del Duomo', 'city' => 'Milan', 'country' => 'Italy', 'latitude' => 45.4642, 'longitude' => 9.1900, 'rating' => 4.5],
            ['name' => 'Isetan Shinjuku', 'description' => 'Major Japanese department store', 'category' => 'shop', 'address' => '3-14-1 Shinjuku', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6910, 'longitude' => 139.7048, 'rating' => 4.5],
            ['name' => 'Bergdorf Goodman', 'description' => 'Luxury department store on Fifth Avenue', 'category' => 'shop', 'address' => '754 5th Ave, New York, NY 10019', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7640, 'longitude' => -73.9744, 'rating' => 4.6],
            ['name' => 'Galeria Kaufhof', 'description' => 'German department store chain', 'category' => 'shop', 'address' => 'Zeil 116-126', 'city' => 'Frankfurt', 'country' => 'Germany', 'latitude' => 50.1155, 'longitude' => 8.6842, 'rating' => 4.3],
            ['name' => 'Nordstrom', 'description' => 'Upscale fashion retailer', 'category' => 'shop', 'address' => '225 W 57th St, New York, NY 10019', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7654, 'longitude' => -73.9800, 'rating' => 4.5],
        ];

        foreach ($institutions as $institution) {
            Institution::create($institution);
        }
    }
}
