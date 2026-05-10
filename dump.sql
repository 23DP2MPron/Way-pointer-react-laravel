-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: way-pointer
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `target_type` varchar(255) NOT NULL,
  `target_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorites_user_id_target_type_target_id_unique` (`user_id`,`target_type`,`target_id`),
  KEY `favorites_target_type_target_id_index` (`target_type`,`target_id`),
  CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,1,'place',4,'2026-05-09 15:54:44','2026-05-09 15:54:44');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institutions`
--

DROP TABLE IF EXISTS `institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `institutions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `institutions_user_id_foreign` (`user_id`),
  CONSTRAINT `institutions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institutions`
--

LOCK TABLES `institutions` WRITE;
/*!40000 ALTER TABLE `institutions` DISABLE KEYS */;
INSERT INTO `institutions` VALUES (1,'Louvre Museum','The world\'s largest art museum and a historic monument in Paris','Rue de Rivoli, 75001','Paris','France',48.86060000,2.33760000,'museum',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(2,'British Museum','Public museum dedicated to human history, art and culture','Great Russell St, London WC1B 3DG','London','United Kingdom',51.51940000,-0.12700000,'museum',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(3,'Metropolitan Museum of Art','The largest art museum in the United States','1000 5th Ave, New York, NY 10028','New York','United States',40.77940000,-73.96320000,'museum',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(4,'Latvian National Museum of Art','The richest collection of national art in Latvia','Jaņa Rozentāla laukums 1','Riga','Latvia',56.95480000,24.11410000,'museum',NULL,4.50,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(5,'Prado Museum','Spain\'s main national art museum','Calle de Ruiz de Alarcón, 23, 28014 Madrid','Madrid','Spain',40.41380000,-3.69210000,'museum',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(6,'Uffizi Gallery','Prominent art museum in Florence','Piazzale degli Uffizi, 6, 50122 Firenze','Florence','Italy',43.76870000,11.25690000,'museum',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(7,'The Ritz Paris','Luxury hotel in the heart of Paris','15 Place Vendôme, 75001','Paris','France',48.86820000,2.32850000,'hotel',NULL,4.90,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(8,'The Savoy','Iconic luxury hotel on the Strand','Strand, London WC2R 0EZ','London','United Kingdom',51.51040000,-0.12040000,'hotel',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(9,'Grand Hotel Riga','Historic luxury hotel in Riga','Aspazijas bulvāris 22','Riga','Latvia',56.95110000,24.11210000,'hotel',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(10,'Hotel Plaza Athénée','Luxury hotel on Avenue Montaigne','25 Avenue Montaigne, 75008','Paris','France',48.86610000,2.30480000,'hotel',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(11,'Le Jules Verne','Michelin-starred restaurant in the Eiffel Tower','Avenue Gustave Eiffel, 75007','Paris','France',48.85830000,2.29450000,'restaurant',NULL,4.90,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(12,'Sketch','Quirky restaurant and afternoon tea venue','9 Conduit St, London W1S 2XG','London','United Kingdom',51.51360000,-0.14100000,'restaurant',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(13,'Vincents','Fine dining restaurant in Riga','Elizabetes iela 19','Riga','Latvia',56.95480000,24.11670000,'restaurant',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(14,'Osteria Francescana','Three Michelin star restaurant','Via Stella, 22, 41121 Modena','Modena','Italy',44.64710000,10.92520000,'restaurant',NULL,5.00,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(15,'Eleven Madison Park','Fine dining restaurant in Manhattan','11 Madison Ave, New York, NY 10010','New York','United States',40.74250000,-73.98710000,'restaurant',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(16,'Café de Flore','Historic café in Saint-Germain-des-Prés','172 Boulevard Saint-Germain, 75006','Paris','France',48.85420000,2.33200000,'cafe',NULL,4.50,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(17,'Caffè Florian','Historic café in St Mark\'s Square','Piazza San Marco, 57, 30124 Venezia','Venice','Italy',45.43380000,12.33780000,'cafe',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(18,'Miit Coffee','Specialty coffee shop in Riga','Tērbatas iela 41/43','Riga','Latvia',56.95770000,24.12110000,'cafe',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(19,'Blue Bottle Coffee','Artisanal coffee roaster and retailer','450 W 15th St, New York, NY 10011','New York','United States',40.74250000,-74.00710000,'cafe',NULL,4.50,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(20,'Harry\'s New York Bar','Historic cocktail bar in Paris','5 Rue Daunou, 75002','Paris','France',48.86930000,2.33180000,'bar',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(21,'The American Bar','Legendary cocktail bar at The Savoy','Strand, London WC2R 0EZ','London','United Kingdom',51.51040000,-0.12040000,'bar',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(22,'Skyline Bar','Rooftop bar with panoramic views','Elizabetes iela 55','Riga','Latvia',56.96150000,24.12130000,'bar',NULL,4.50,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(23,'Galeries Lafayette','Upscale French department store','40 Boulevard Haussmann, 75009','Paris','France',48.87380000,2.33200000,'shop',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(24,'Harrods','Luxury department store in Knightsbridge','87-135 Brompton Rd, London SW1X 7XL','London','United Kingdom',51.49940000,-0.16320000,'shop',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(25,'Stockmann','Department store in central Riga','13. janvāra iela 8','Riga','Latvia',56.94960000,24.11630000,'shop',NULL,4.40,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(26,'Macy\'s Herald Square','Iconic department store in Manhattan','151 W 34th St, New York, NY 10001','New York','United States',40.75080000,-73.98970000,'shop',NULL,4.50,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(27,'Vatican Museums','Public art and sculpture museums in Vatican City','Viale Vaticano, 00165 Roma','Rome','Italy',41.90650000,12.45360000,'museum',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(28,'Hermitage Museum','Museum of art and culture in Saint Petersburg','Palace Square, 2','Saint Petersburg','Russia',59.93980000,30.31460000,'museum',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(29,'Rijksmuseum','Dutch national museum dedicated to arts and history','Museumstraat 1, 1071 XX Amsterdam','Amsterdam','Netherlands',52.36000000,4.88520000,'museum',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(30,'National Museum of China','Museum of Chinese art and history','16 East Chang\'an Avenue','Beijing','China',39.90420000,116.39740000,'museum',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(31,'Burj Al Arab','Luxury hotel on an artificial island','Jumeirah St, Dubai','Dubai','United Arab Emirates',25.14130000,55.18530000,'hotel',NULL,4.90,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(32,'Marina Bay Sands','Integrated resort with iconic rooftop','10 Bayfront Ave','Singapore','Singapore',1.28340000,103.86070000,'hotel',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(33,'The Plaza Hotel','Luxury hotel and landmark in Manhattan','Fifth Avenue at Central Park South','New York','United States',40.76440000,-73.97440000,'hotel',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(34,'Raffles Hotel','Colonial-style luxury hotel','1 Beach Rd','Singapore','Singapore',1.29460000,103.85400000,'hotel',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(35,'Noma','Two Michelin star restaurant','Refshalevej 96','Copenhagen','Denmark',55.69610000,12.61130000,'restaurant',NULL,4.90,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(36,'El Celler de Can Roca','Three Michelin star restaurant','Carrer de Can Sunyer, 48','Girona','Spain',41.97940000,2.82140000,'restaurant',NULL,4.90,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(37,'Sukiyabashi Jiro','Three Michelin star sushi restaurant','Tsukamoto Sogyo Building B1F','Tokyo','Japan',35.66840000,139.76380000,'restaurant',NULL,5.00,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(38,'The French Laundry','Three Michelin star French restaurant','6640 Washington St','Yountville','United States',38.40240000,-122.36250000,'restaurant',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(39,'Café Central','Traditional Viennese coffeehouse','Herrengasse 14','Vienna','Austria',48.21040000,16.36500000,'cafe',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(40,'Café Tortoni','Historic café in Buenos Aires','Av. de Mayo 825','Buenos Aires','Argentina',-34.60880000,-58.37560000,'cafe',NULL,4.50,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(41,'Café Majestic','Belle Époque café in Porto','Rua Santa Catarina 112','Porto','Portugal',41.14960000,-8.61090000,'cafe',NULL,4.60,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(42,'Employees Only','Speakeasy-style cocktail bar','510 Hudson St','New York','United States',40.73390000,-74.00620000,'bar',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(43,'Artesian','Award-winning cocktail bar','1C Portland Pl','London','United Kingdom',51.51860000,-0.14360000,'bar',NULL,4.80,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00'),(44,'Bar Hemingway','Legendary bar at the Ritz Paris','15 Place Vendôme','Paris','France',48.86820000,2.32850000,'bar',NULL,4.70,NULL,'2026-05-03 18:01:00','2026-05-03 18:01:00');
/*!40000 ALTER TABLE `institutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_04_18_221641_add_role_to_users_table',1),(5,'2026_04_18_221906_create_waypointer_tables.',1),(6,'2026_04_19_095410_create_personal_access_tokens_table',1),(7,'2026_04_25_195116_add_role_column_to_users_table',1),(8,'2026_04_26_094310_add_location_fields_to_routes_table',1),(9,'2026_04_26_094447_create_route_points_table',1),(10,'2026_04_26_094644_create_favorites_table',1),(11,'2026_04_26_094751_add_view_count_to_routes_table',1),(12,'2026_04_26_101409_create_institutions_table',1),(13,'2026_04_26_101605_add_coordinates_to_places_table',1),(14,'2026_04_26_130718_update_route_points_table_structure',1),(15,'2026_05_01_140755_increase_image_url_length_in_places_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (3,'user',1,'auth_token','c02ceed15d42434969bf4e6f4690dba44046f5321f6b3d71d20e515303f7ef11','[\"*\"]','2026-05-09 16:45:12',NULL,'2026-05-03 18:45:21','2026-05-09 16:45:12'),(4,'user',1,'auth_token','b1c50e070ed875cfb05a649a1528b94578a37886055c7f83203db5841da26c74','[\"*\"]','2026-05-10 12:41:11',NULL,'2026-05-10 05:27:14','2026-05-10 12:41:11');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `places` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `type` enum('park','museum','landmark','nature') NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `places_user_id_foreign` (`user_id`),
  CONSTRAINT `places_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `places`
--

LOCK TABLES `places` WRITE;
/*!40000 ALTER TABLE `places` DISABLE KEYS */;
INSERT INTO `places` VALUES (1,'Eiffel Tower','Iconic iron lattice tower on the Champ de Mars in Paris',NULL,'park',NULL,'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop','Paris','France',48.85840000,2.29450000,'landmark',4.80,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(2,'Central Park','Large public park in Manhattan, New York City',NULL,'park',NULL,'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&h=600&fit=crop','New York','United States',40.78290000,-73.96540000,'park',4.70,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(3,'Colosseum','Ancient amphitheatre in the centre of Rome',NULL,'park',NULL,'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop','Rome','Italy',41.89020000,12.49220000,'landmark',4.90,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(4,'Big Ben','The Great Bell of the clock at the north end of the Palace of Westminster',NULL,'park',NULL,'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop','London','United Kingdom',51.50070000,-0.12460000,'landmark',4.60,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(5,'Riga Old Town','Historic centre and a UNESCO World Heritage Site',NULL,'park',NULL,'https://images.unsplash.com/photo-1593659039409-c2e4f3e6c636?w=800&h=600&fit=crop','Riga','Latvia',56.94960000,24.10520000,'landmark',4.80,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(6,'Statue of Liberty','Colossal neoclassical sculpture on Liberty Island',NULL,'park',NULL,'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800&h=600&fit=crop','New York','United States',40.68920000,-74.04450000,'landmark',4.70,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(7,'Taj Mahal','Ivory-white marble mausoleum in Agra',NULL,'park',NULL,'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop','Agra','India',27.17510000,78.04210000,'landmark',4.90,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(8,'Great Wall of China','Ancient series of fortifications in northern China',NULL,'park',NULL,'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop','Beijing','China',40.43190000,116.57040000,'landmark',4.80,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(9,'Machu Picchu','15th-century Inca citadel in the Andes Mountains',NULL,'park',NULL,'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop','Cusco','Peru',-13.16310000,-72.54500000,'landmark',4.90,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(10,'Sydney Opera House','Multi-venue performing arts centre in Sydney',NULL,'park',NULL,'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800&h=600&fit=crop','Sydney','Australia',-33.85680000,151.21530000,'landmark',4.70,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(11,'Sagrada Familia','Large unfinished Roman Catholic basilica designed by Gaudí',NULL,'park',NULL,'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop','Barcelona','Spain',41.40360000,2.17440000,'landmark',4.80,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(12,'Petra','Archaeological city famous for rock-cut architecture',NULL,'park',NULL,'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=800&h=600&fit=crop','Ma\'an','Jordan',30.32850000,35.44440000,'landmark',4.90,'2026-05-03 18:00:59','2026-05-03 18:00:59',NULL),(13,'Acropolis of Athens','Ancient citadel on a rocky outcrop above Athens',NULL,'park',NULL,'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop','Athens','Greece',37.97150000,23.72670000,'landmark',4.70,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(14,'Christ the Redeemer','Art Deco statue of Jesus Christ in Rio de Janeiro',NULL,'park',NULL,'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop','Rio de Janeiro','Brazil',-22.95190000,-43.21050000,'landmark',4.80,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(15,'Angkor Wat','Temple complex and largest religious monument in the world',NULL,'park',NULL,'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&h=600&fit=crop','Siem Reap','Cambodia',13.41250000,103.86700000,'landmark',4.90,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(16,'Neuschwanstein Castle','19th-century Romanesque Revival palace in Bavaria',NULL,'park',NULL,'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop','Schwangau','Germany',47.55760000,10.74980000,'landmark',4.70,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(17,'Golden Gate Bridge','Iconic suspension bridge spanning the Golden Gate strait',NULL,'park',NULL,'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop','San Francisco','United States',37.81990000,-122.47830000,'landmark',4.80,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(18,'Burj Khalifa','Tallest structure and building in the world',NULL,'park',NULL,'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop','Dubai','United Arab Emirates',25.19720000,55.27440000,'landmark',4.70,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(19,'Mount Fuji','Active stratovolcano and highest mountain in Japan',NULL,'park',NULL,'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop','Fujinomiya','Japan',35.36060000,138.72740000,'nature',4.80,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(20,'Niagara Falls','Group of three waterfalls at the border of Ontario and New York',NULL,'park',NULL,'https://images.unsplash.com/photo-1489447068241-b3490214e879?w=800&h=600&fit=crop','Niagara Falls','Canada',43.08960000,-79.08490000,'nature',4.70,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL),(21,'Grand Canyon','Steep-sided canyon carved by the Colorado River',NULL,'park',NULL,'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800&h=600&fit=crop','Arizona','United States',36.10690000,-112.11290000,'nature',4.90,'2026-05-03 18:01:00','2026-05-03 18:01:00',NULL);
/*!40000 ALTER TABLE `places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `reviewable_type` varchar(255) NOT NULL,
  `reviewable_id` bigint(20) unsigned NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  KEY `reviews_reviewable_type_reviewable_id_index` (`reviewable_type`,`reviewable_id`),
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route_points`
--

DROP TABLE IF EXISTS `route_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `route_points` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `route_id` bigint(20) unsigned NOT NULL,
  `target_type` varchar(255) NOT NULL,
  `target_id` bigint(20) unsigned NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `route_points_route_id_foreign` (`route_id`),
  CONSTRAINT `route_points_route_id_foreign` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route_points`
--

LOCK TABLES `route_points` WRITE;
/*!40000 ALTER TABLE `route_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `route_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `view_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `routes_user_id_foreign` (`user_id`),
  CONSTRAINT `routes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@waypointer.com','2026-05-03 18:00:59','$2y$12$m7Dwbbo3juC3rTkIiPai8ucSaUzVcNsbqeTYf.CB4WU2E2XfBb1Oe','admin',NULL,'2026-05-03 18:00:59','2026-05-03 18:00:59'),(3,'max','max@gmail.com',NULL,'$2y$12$mxrO85QZA8rguxhjRil9h.X.01.JxFyZ9qfTHV.Kh/CLiyzwQ6sKi','user',NULL,'2026-05-03 18:36:06','2026-05-03 18:36:06');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-10 18:52:30
