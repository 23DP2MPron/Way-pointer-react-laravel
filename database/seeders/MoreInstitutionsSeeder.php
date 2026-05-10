<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Institution;

class MoreInstitutionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institutions = [
            // More Museums
            ['name' => 'Vatican Museums', 'description' => 'Art and Christian museums in Vatican City', 'category' => 'museum', 'address' => 'Viale Vaticano, 00165', 'city' => 'Vatican City', 'country' => 'Vatican City', 'latitude' => 41.9065, 'longitude' => 12.4536, 'rating' => 4.7],
            ['name' => 'Hermitage Museum', 'description' => 'Museum of art and culture in Saint Petersburg', 'category' => 'museum', 'address' => 'Palace Square, 2', 'city' => 'Saint Petersburg', 'country' => 'Russia', 'latitude' => 59.9398, 'longitude' => 30.3146, 'rating' => 4.8],
            ['name' => 'Rijksmuseum', 'description' => 'Dutch national museum in Amsterdam', 'category' => 'museum', 'address' => 'Museumstraat 1', 'city' => 'Amsterdam', 'country' => 'Netherlands', 'latitude' => 52.3600, 'longitude' => 4.8852, 'rating' => 4.7],
            ['name' => 'National Gallery', 'description' => 'Art museum in Trafalgar Square', 'category' => 'museum', 'address' => 'Trafalgar Square, London WC2N 5DN', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5089, 'longitude' => -0.1283, 'rating' => 4.7],
            ['name' => 'Smithsonian National Museum', 'description' => 'Natural history museum in Washington DC', 'category' => 'museum', 'address' => '10th St. & Constitution Ave. NW', 'city' => 'Washington', 'country' => 'United States', 'latitude' => 38.8913, 'longitude' => -77.0261, 'rating' => 4.8],
            ['name' => 'Acropolis Museum', 'description' => 'Archaeological museum in Athens', 'category' => 'museum', 'address' => 'Dionysiou Areopagitou 15', 'city' => 'Athens', 'country' => 'Greece', 'latitude' => 37.9684, 'longitude' => 23.7283, 'rating' => 4.8],
            ['name' => 'Tokyo National Museum', 'description' => 'Oldest and largest museum in Japan', 'category' => 'museum', 'address' => '13-9 Uenokoen, Taito City', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.7188, 'longitude' => 139.7764, 'rating' => 4.6],
            ['name' => 'Egyptian Museum', 'description' => 'Ancient Egyptian antiquities museum', 'category' => 'museum', 'address' => 'Meret Basha, Ismailia', 'city' => 'Cairo', 'country' => 'Egypt', 'latitude' => 30.0478, 'longitude' => 31.2336, 'rating' => 4.5],
            
            // More Hotels
            ['name' => 'Burj Al Arab', 'description' => 'Luxury hotel on artificial island', 'category' => 'hotel', 'address' => 'Jumeirah St', 'city' => 'Dubai', 'country' => 'United Arab Emirates', 'latitude' => 25.1413, 'longitude' => 55.1853, 'rating' => 4.9],
            ['name' => 'Marina Bay Sands', 'description' => 'Integrated resort with rooftop infinity pool', 'category' => 'hotel', 'address' => '10 Bayfront Ave', 'city' => 'Singapore', 'country' => 'Singapore', 'latitude' => 1.2834, 'longitude' => 103.8607, 'rating' => 4.7],
            ['name' => 'The Peninsula Hong Kong', 'description' => 'Historic luxury hotel in Kowloon', 'category' => 'hotel', 'address' => 'Salisbury Rd, Tsim Sha Tsui', 'city' => 'Hong Kong', 'country' => 'Hong Kong', 'latitude' => 22.2943, 'longitude' => 114.1722, 'rating' => 4.8],
            ['name' => 'Hotel Adlon Kempinski', 'description' => 'Luxury hotel near Brandenburg Gate', 'category' => 'hotel', 'address' => 'Unter den Linden 77', 'city' => 'Berlin', 'country' => 'Germany', 'latitude' => 52.5163, 'longitude' => 13.3807, 'rating' => 4.7],
            ['name' => 'Copacabana Palace', 'description' => 'Iconic beachfront hotel in Rio', 'category' => 'hotel', 'address' => 'Av. Atlântica, 1702', 'city' => 'Rio de Janeiro', 'country' => 'Brazil', 'latitude' => -22.9683, 'longitude' => -43.1769, 'rating' => 4.8],
            ['name' => 'The Oberoi Udaivilas', 'description' => 'Palace hotel on Lake Pichola', 'category' => 'hotel', 'address' => 'Haridasji Ki Magri', 'city' => 'Udaipur', 'country' => 'India', 'latitude' => 24.5760, 'longitude' => 73.6807, 'rating' => 4.9],
            ['name' => 'Aman Tokyo', 'description' => 'Minimalist luxury hotel in Otemachi', 'category' => 'hotel', 'address' => '1-5-6 Otemachi, Chiyoda City', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6895, 'longitude' => 139.7656, 'rating' => 4.8],
            ['name' => 'Claridge\'s', 'description' => 'Art Deco hotel in Mayfair', 'category' => 'hotel', 'address' => 'Brook St, London W1K 4HR', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5126, 'longitude' => -0.1481, 'rating' => 4.8],
            
            // More Restaurants
            ['name' => 'Noma', 'description' => 'New Nordic cuisine restaurant', 'category' => 'restaurant', 'address' => 'Refshalevej 96', 'city' => 'Copenhagen', 'country' => 'Denmark', 'latitude' => 55.6961, 'longitude' => 12.6113, 'rating' => 4.9],
            ['name' => 'El Celler de Can Roca', 'description' => 'Three Michelin star restaurant', 'category' => 'restaurant', 'address' => 'Carrer de Can Sunyer, 48', 'city' => 'Girona', 'country' => 'Spain', 'latitude' => 41.9794, 'longitude' => 2.8214, 'rating' => 4.9],
            ['name' => 'Sukiyabashi Jiro', 'description' => 'Famous sushi restaurant', 'category' => 'restaurant', 'address' => 'Tsukamoto Sogyo Building B1F', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6684, 'longitude' => 139.7638, 'rating' => 4.8],
            ['name' => 'Le Bernardin', 'description' => 'Seafood restaurant in Midtown', 'category' => 'restaurant', 'address' => '155 W 51st St, New York, NY 10019', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7614, 'longitude' => -73.9776, 'rating' => 4.8],
            ['name' => 'Alain Ducasse au Plaza Athénée', 'description' => 'Three Michelin star French restaurant', 'category' => 'restaurant', 'address' => '25 Avenue Montaigne, 75008', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8661, 'longitude' => 2.3048, 'rating' => 4.9],
            ['name' => 'The Fat Duck', 'description' => 'Experimental cuisine restaurant', 'category' => 'restaurant', 'address' => 'High St, Bray', 'city' => 'Bray', 'country' => 'United Kingdom', 'latitude' => 51.5078, 'longitude' => -0.7028, 'rating' => 4.7],
            ['name' => 'Alinea', 'description' => 'Molecular gastronomy restaurant', 'category' => 'restaurant', 'address' => '1723 N Halsted St, Chicago, IL 60614', 'city' => 'Chicago', 'country' => 'United States', 'latitude' => 41.9134, 'longitude' => -87.6489, 'rating' => 4.8],
            ['name' => 'Geranium', 'description' => 'Three Michelin star Nordic restaurant', 'category' => 'restaurant', 'address' => 'Per Henrik Lings Allé 4', 'city' => 'Copenhagen', 'country' => 'Denmark', 'latitude' => 55.7017, 'longitude' => 12.5722, 'rating' => 4.9],
            
            // More Cafes
            ['name' => 'Café Central', 'description' => 'Historic Viennese coffeehouse', 'category' => 'cafe', 'address' => 'Herrengasse 14', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2105, 'longitude' => 16.3650, 'rating' => 4.5],
            ['name' => 'Café Tortoni', 'description' => 'Historic café in Buenos Aires', 'category' => 'cafe', 'address' => 'Av. de Mayo 825', 'city' => 'Buenos Aires', 'country' => 'Argentina', 'latitude' => -34.6088, 'longitude' => -58.3756, 'rating' => 4.4],
            ['name' => 'Café Majestic', 'description' => 'Belle Époque café in Porto', 'category' => 'cafe', 'address' => 'Rua Santa Catarina 112', 'city' => 'Porto', 'country' => 'Portugal', 'latitude' => 41.1496, 'longitude' => -8.6109, 'rating' => 4.5],
            ['name' => 'Café Gijón', 'description' => 'Literary café in Madrid', 'category' => 'cafe', 'address' => 'Paseo de Recoletos, 21', 'city' => 'Madrid', 'country' => 'Spain', 'latitude' => 40.4238, 'longitude' => -3.6926, 'rating' => 4.3],
            ['name' => 'Café Hawelka', 'description' => 'Traditional Viennese café', 'category' => 'cafe', 'address' => 'Dorotheergasse 6', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2088, 'longitude' => 16.3688, 'rating' => 4.4],
            ['name' => 'Café Pushkin', 'description' => 'Russian-style café in Moscow', 'category' => 'cafe', 'address' => 'Tverskoy Blvd, 26А', 'city' => 'Moscow', 'country' => 'Russia', 'latitude' => 55.7654, 'longitude' => 37.6045, 'rating' => 4.6],
            ['name' => 'Angelina Paris', 'description' => 'Famous for hot chocolate', 'category' => 'cafe', 'address' => '226 Rue de Rivoli, 75001', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8656, 'longitude' => 2.3279, 'rating' => 4.4],
            ['name' => 'Café Sacher', 'description' => 'Home of the Sacher torte', 'category' => 'cafe', 'address' => 'Philharmoniker Str. 4', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2038, 'longitude' => 16.3695, 'rating' => 4.5],
            
            // More Bars
            ['name' => 'Dry Martini', 'description' => 'Classic cocktail bar in Barcelona', 'category' => 'bar', 'address' => 'Carrer d\'Aribau, 162', 'city' => 'Barcelona', 'country' => 'Spain', 'latitude' => 41.3926, 'longitude' => 2.1543, 'rating' => 4.6],
            ['name' => 'Artesian Bar', 'description' => 'Award-winning bar at The Langham', 'category' => 'bar', 'address' => '1C Portland Pl, London W1B 1JA', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5174, 'longitude' => -0.1433, 'rating' => 4.7],
            ['name' => 'Dead Rabbit', 'description' => 'Irish pub and cocktail bar', 'category' => 'bar', 'address' => '30 Water St, New York, NY 10004', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7033, 'longitude' => -74.0106, 'rating' => 4.6],
            ['name' => 'Connaught Bar', 'description' => 'Elegant cocktail bar in Mayfair', 'category' => 'bar', 'address' => 'Carlos Pl, London W1K 2AL', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5107, 'longitude' => -0.1489, 'rating' => 4.7],
            ['name' => 'Bar Hemingway', 'description' => 'Historic bar at Ritz Paris', 'category' => 'bar', 'address' => '15 Place Vendôme, 75001', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8682, 'longitude' => 2.3285, 'rating' => 4.6],
            ['name' => 'Manhattan Bar', 'description' => 'Sophisticated cocktail bar in Singapore', 'category' => 'bar', 'address' => '1 Cuscaden Rd', 'city' => 'Singapore', 'country' => 'Singapore', 'latitude' => 1.3048, 'longitude' => 103.8318, 'rating' => 4.7],
            ['name' => 'Employees Only', 'description' => 'Speakeasy-style cocktail bar', 'category' => 'bar', 'address' => '510 Hudson St, New York, NY 10014', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7339, 'longitude' => -74.0063, 'rating' => 4.5],
            ['name' => 'Nomad Bar', 'description' => 'Craft cocktail bar in NoMad', 'category' => 'bar', 'address' => '10 W 28th St, New York, NY 10001', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7451, 'longitude' => -73.9882, 'rating' => 4.6],
            
            // More Shops
            ['name' => 'Selfridges', 'description' => 'Department store on Oxford Street', 'category' => 'shop', 'address' => '400 Oxford St, London W1A 1AB', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5145, 'longitude' => -0.1527, 'rating' => 4.6],
            ['name' => 'KaDeWe', 'description' => 'Luxury department store in Berlin', 'category' => 'shop', 'address' => 'Tauentzienstraße 21-24', 'city' => 'Berlin', 'country' => 'Germany', 'latitude' => 52.5024, 'longitude' => 13.3416, 'rating' => 4.6],
            ['name' => 'Le Bon Marché', 'description' => 'Historic department store in Paris', 'category' => 'shop', 'address' => '24 Rue de Sèvres, 75007', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8511, 'longitude' => 2.3242, 'rating' => 4.5],
            ['name' => 'Takashimaya', 'description' => 'Japanese department store', 'category' => 'shop', 'address' => '5-24-2 Sendagaya, Shibuya City', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6897, 'longitude' => 139.7006, 'rating' => 4.5],
            ['name' => 'Bloomingdale\'s', 'description' => 'Luxury department store chain', 'category' => 'shop', 'address' => '1000 3rd Ave, New York, NY 10022', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7625, 'longitude' => -73.9676, 'rating' => 4.5],
            ['name' => 'El Corte Inglés', 'description' => 'Spanish department store chain', 'category' => 'shop', 'address' => 'Calle de Preciados, 3', 'city' => 'Madrid', 'country' => 'Spain', 'latitude' => 40.4189, 'longitude' => -3.7067, 'rating' => 4.4],
            ['name' => 'Fortnum & Mason', 'description' => 'Upscale department store in Piccadilly', 'category' => 'shop', 'address' => '181 Piccadilly, London W1A 1ER', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5077, 'longitude' => -0.1375, 'rating' => 4.6],
            ['name' => 'Printemps', 'description' => 'Fashion-oriented department store', 'category' => 'shop', 'address' => '64 Boulevard Haussmann, 75009', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8738, 'longitude' => 2.3282, 'rating' => 4.5],
            
            // Additional Hotels
            ['name' => 'Four Seasons George V', 'description' => 'Luxury hotel near Champs-Élysées', 'category' => 'hotel', 'address' => '31 Avenue George V, 75008', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8686, 'longitude' => 2.3007, 'rating' => 4.8],
            ['name' => 'The Dorchester', 'description' => 'Luxury hotel in Park Lane', 'category' => 'hotel', 'address' => 'Park Ln, London W1K 1QA', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5074, 'longitude' => -0.1519, 'rating' => 4.8],
            ['name' => 'Mandarin Oriental Bangkok', 'description' => 'Riverside luxury hotel', 'category' => 'hotel', 'address' => '48 Oriental Ave', 'city' => 'Bangkok', 'country' => 'Thailand', 'latitude' => 13.7244, 'longitude' => 100.5151, 'rating' => 4.7],
            ['name' => 'The St. Regis New York', 'description' => 'Historic luxury hotel in Midtown', 'category' => 'hotel', 'address' => '2 E 55th St, New York, NY 10022', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7615, 'longitude' => -73.9744, 'rating' => 4.7],
            ['name' => 'Raffles Singapore', 'description' => 'Colonial-style luxury hotel', 'category' => 'hotel', 'address' => '1 Beach Rd', 'city' => 'Singapore', 'country' => 'Singapore', 'latitude' => 1.2946, 'longitude' => 103.8535, 'rating' => 4.7],
            ['name' => 'Hotel Sacher Wien', 'description' => 'Historic luxury hotel opposite Opera', 'category' => 'hotel', 'address' => 'Philharmoniker Str. 4', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2038, 'longitude' => 16.3695, 'rating' => 4.7],
            ['name' => 'Belmond Hotel Cipriani', 'description' => 'Luxury hotel on Giudecca island', 'category' => 'hotel', 'address' => 'Giudecca 10', 'city' => 'Venice', 'country' => 'Italy', 'latitude' => 45.4236, 'longitude' => 12.3406, 'rating' => 4.8],
            ['name' => 'The Langham London', 'description' => 'Historic grand hotel in Marylebone', 'category' => 'hotel', 'address' => '1C Portland Pl, London W1B 1JA', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5174, 'longitude' => -0.1433, 'rating' => 4.7],
            
            // Additional Restaurants
            ['name' => 'Mirazur', 'description' => 'Three Michelin star restaurant in Menton', 'category' => 'restaurant', 'address' => '30 Avenue Aristide Briand', 'city' => 'Menton', 'country' => 'France', 'latitude' => 43.7750, 'longitude' => 7.5028, 'rating' => 4.9],
            ['name' => 'Arzak', 'description' => 'Three Michelin star Basque restaurant', 'category' => 'restaurant', 'address' => 'Av. Alcalde José Elosegui, 273', 'city' => 'San Sebastián', 'country' => 'Spain', 'latitude' => 43.3078, 'longitude' => -1.9647, 'rating' => 4.8],
            ['name' => 'Piazza Duomo', 'description' => 'Three Michelin star Italian restaurant', 'category' => 'restaurant', 'address' => 'Piazza Risorgimento, 4', 'city' => 'Alba', 'country' => 'Italy', 'latitude' => 44.7007, 'longitude' => 8.0357, 'rating' => 4.9],
            ['name' => 'Quintonil', 'description' => 'Contemporary Mexican cuisine', 'category' => 'restaurant', 'address' => 'Av. Isaac Newton 55', 'city' => 'Mexico City', 'country' => 'Mexico', 'latitude' => 19.4326, 'longitude' => -99.2044, 'rating' => 4.7],
            ['name' => 'Gaggan', 'description' => 'Progressive Indian cuisine', 'category' => 'restaurant', 'address' => '68/1 Soi Langsuan', 'city' => 'Bangkok', 'country' => 'Thailand', 'latitude' => 13.7392, 'longitude' => 100.5428, 'rating' => 4.8],
            ['name' => 'Narisawa', 'description' => 'Innovative Japanese cuisine', 'category' => 'restaurant', 'address' => '2-6-15 Minami-Aoyama, Minato City', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6654, 'longitude' => 139.7145, 'rating' => 4.8],
            ['name' => 'Central', 'description' => 'Contemporary Peruvian restaurant', 'category' => 'restaurant', 'address' => 'Av. Pedro de Osma 301', 'city' => 'Lima', 'country' => 'Peru', 'latitude' => -12.0707, 'longitude' => -77.0181, 'rating' => 4.8],
            ['name' => 'Attica', 'description' => 'Modern Australian cuisine', 'category' => 'restaurant', 'address' => '74 Glen Eira Rd', 'city' => 'Melbourne', 'country' => 'Australia', 'latitude' => -37.8770, 'longitude' => 145.0009, 'rating' => 4.7],
            
            // Additional Museums
            ['name' => 'Guggenheim Museum', 'description' => 'Modern and contemporary art museum', 'category' => 'museum', 'address' => '1071 5th Ave, New York, NY 10128', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7830, 'longitude' => -73.9590, 'rating' => 4.7],
            ['name' => 'Tate Modern', 'description' => 'Modern art gallery in former power station', 'category' => 'museum', 'address' => 'Bankside, London SE1 9TG', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5076, 'longitude' => -0.0994, 'rating' => 4.6],
            ['name' => 'Musée d\'Orsay', 'description' => 'Impressionist and post-Impressionist art', 'category' => 'museum', 'address' => '1 Rue de la Légion d\'Honneur, 75007', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8600, 'longitude' => 2.3266, 'rating' => 4.7],
            ['name' => 'Van Gogh Museum', 'description' => 'Museum dedicated to Vincent van Gogh', 'category' => 'museum', 'address' => 'Museumplein 6', 'city' => 'Amsterdam', 'country' => 'Netherlands', 'latitude' => 52.3584, 'longitude' => 4.8811, 'rating' => 4.7],
            ['name' => 'Reina Sofía', 'description' => 'Spanish national museum of 20th-century art', 'category' => 'museum', 'address' => 'Calle de Santa Isabel, 52', 'city' => 'Madrid', 'country' => 'Spain', 'latitude' => 40.4080, 'longitude' => -3.6937, 'rating' => 4.6],
            ['name' => 'Pergamon Museum', 'description' => 'Museum of ancient artifacts', 'category' => 'museum', 'address' => 'Bodestraße 1-3', 'city' => 'Berlin', 'country' => 'Germany', 'latitude' => 52.5211, 'longitude' => 13.3969, 'rating' => 4.6],
            ['name' => 'National Museum of China', 'description' => 'Museum of Chinese art and history', 'category' => 'museum', 'address' => '16 East Chang\'an Avenue', 'city' => 'Beijing', 'country' => 'China', 'latitude' => 39.9042, 'longitude' => 116.3974, 'rating' => 4.5],
            ['name' => 'State Tretyakov Gallery', 'description' => 'Art gallery of Russian fine art', 'category' => 'museum', 'address' => 'Lavrushinsky Ln, 10', 'city' => 'Moscow', 'country' => 'Russia', 'latitude' => 55.7414, 'longitude' => 37.6207, 'rating' => 4.7],
            
            // Additional Cafes
            ['name' => 'Café Sperl', 'description' => 'Traditional Viennese coffeehouse', 'category' => 'cafe', 'address' => 'Gumpendorfer Str. 11', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.1979, 'longitude' => 16.3534, 'rating' => 4.5],
            ['name' => 'Café Procope', 'description' => 'Oldest café in Paris', 'category' => 'cafe', 'address' => '13 Rue de l\'Ancienne Comédie, 75006', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8530, 'longitude' => 2.3391, 'rating' => 4.3],
            ['name' => 'Café Landtmann', 'description' => 'Grand café near Burgtheater', 'category' => 'cafe', 'address' => 'Universitätsring 4', 'city' => 'Vienna', 'country' => 'Austria', 'latitude' => 48.2108, 'longitude' => 16.3594, 'rating' => 4.4],
            ['name' => 'Café A Brasileira', 'description' => 'Historic café in Chiado', 'category' => 'cafe', 'address' => 'Rua Garrett 120', 'city' => 'Lisbon', 'country' => 'Portugal', 'latitude' => 38.7107, 'longitude' => -9.1422, 'rating' => 4.3],
            ['name' => 'Café Comercial', 'description' => 'Historic café in Glorieta de Bilbao', 'category' => 'cafe', 'address' => 'Glorieta de Bilbao, 7', 'city' => 'Madrid', 'country' => 'Spain', 'latitude' => 40.4294, 'longitude' => -3.7019, 'rating' => 4.2],
            ['name' => 'Café Louvre', 'description' => 'Historic café in Prague', 'category' => 'cafe', 'address' => 'Národní 22', 'city' => 'Prague', 'country' => 'Czech Republic', 'latitude' => 50.0820, 'longitude' => 14.4189, 'rating' => 4.4],
            ['name' => 'Café Imperial', 'description' => 'Art Nouveau café in Prague', 'category' => 'cafe', 'address' => 'Na Poříčí 1072/15', 'city' => 'Prague', 'country' => 'Czech Republic', 'latitude' => 50.0897, 'longitude' => 14.4329, 'rating' => 4.5],
            ['name' => 'Café New York', 'description' => 'Historic café in Budapest', 'category' => 'cafe', 'address' => 'Erzsébet krt. 9-11', 'city' => 'Budapest', 'country' => 'Hungary', 'latitude' => 47.5007, 'longitude' => 19.0700, 'rating' => 4.4],
            
            // More diverse institutions
            ['name' => 'Ritz-Carlton Tokyo', 'description' => 'Luxury hotel in Roppongi', 'category' => 'hotel', 'address' => '9-7-1 Akasaka, Minato City', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6654, 'longitude' => 139.7297, 'rating' => 4.8],
            ['name' => 'Park Hyatt Tokyo', 'description' => 'Luxury hotel in Shinjuku', 'category' => 'hotel', 'address' => '3-7-1-2 Nishi Shinjuku', 'city' => 'Tokyo', 'country' => 'Japan', 'latitude' => 35.6852, 'longitude' => 139.6917, 'rating' => 4.7],
            ['name' => 'The Gritti Palace', 'description' => 'Historic luxury hotel on Grand Canal', 'category' => 'hotel', 'address' => 'Campo Santa Maria del Giglio', 'city' => 'Venice', 'country' => 'Italy', 'latitude' => 45.4318, 'longitude' => 12.3352, 'rating' => 4.8],
            ['name' => 'Hotel Danieli', 'description' => 'Luxury hotel near St Mark\'s Square', 'category' => 'hotel', 'address' => 'Riva degli Schiavoni, 4196', 'city' => 'Venice', 'country' => 'Italy', 'latitude' => 45.4338, 'longitude' => 12.3422, 'rating' => 4.7],
            ['name' => 'Hôtel de Crillon', 'description' => 'Palace hotel on Place de la Concorde', 'category' => 'hotel', 'address' => '10 Place de la Concorde, 75008', 'city' => 'Paris', 'country' => 'France', 'latitude' => 48.8682, 'longitude' => 2.3210, 'rating' => 4.8],
            ['name' => 'The Connaught', 'description' => 'Luxury hotel in Mayfair', 'category' => 'hotel', 'address' => 'Carlos Pl, London W1K 2AL', 'city' => 'London', 'country' => 'United Kingdom', 'latitude' => 51.5107, 'longitude' => -0.1489, 'rating' => 4.8],
            ['name' => 'Waldorf Astoria New York', 'description' => 'Historic luxury hotel in Midtown', 'category' => 'hotel', 'address' => '301 Park Ave, New York, NY 10022', 'city' => 'New York', 'country' => 'United States', 'latitude' => 40.7565, 'longitude' => -73.9744, 'rating' => 4.6],
            ['name' => 'The Beverly Hills Hotel', 'description' => 'Iconic pink palace hotel', 'category' => 'hotel', 'address' => '9641 Sunset Blvd, Beverly Hills, CA 90210', 'city' => 'Los Angeles', 'country' => 'United States', 'latitude' => 34.0781, 'longitude' => -118.4147, 'rating' => 4.7],
        ];

        foreach ($institutions as $institution) {
            Institution::create($institution);
        }
    }
}
