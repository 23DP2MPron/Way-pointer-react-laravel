#!/bin/bash
set -e

# Create symbolic links for Laravel logs to stdout/stderr
ln -sf /dev/stdout /var/www/html/storage/logs/laravel.log
ln -sf /dev/stderr /var/www/html/storage/logs/laravel-error.log

# Start Apache
exec apache2-foreground
