FROM php:8.2-apache

# Cache bust: 2026-05-10-v5
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache

RUN a2enmod rewrite

RUN echo '<VirtualHost *:8080>\n\
    DocumentRoot /var/www/html/public\n\
    DirectoryIndex index.php index.html\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    <FilesMatch \.php$>\n\
        SetHandler application/x-httpd-php\n\
    </FilesMatch>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

RUN echo 'Listen 8080' > /etc/apache2/ports.conf && \
    echo 'ServerName localhost' >> /etc/apache2/apache2.conf

EXPOSE 8080

CMD ["bash", "-c", \
    "find /etc/apache2 -name 'mpm_*.load' -delete && \
     find /etc/apache2 -name 'mpm_*.conf' -delete && \
     echo 'LoadModule mpm_prefork_module /usr/lib/apache2/modules/mod_mpm_prefork.so' \
         > /etc/apache2/mods-enabled/mpm_prefork.load && \
     chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
     php artisan config:cache 2>&1 && \
     php artisan migrate --force 2>&1 && \
     apache2-foreground"]