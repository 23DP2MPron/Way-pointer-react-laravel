#!/bin/sh
set -e

echo "Running migrations..."
php artisan migrate --force

echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo "Starting server..."
exec php -S 0.0.0.0:8080 -t /var/www/html/public
