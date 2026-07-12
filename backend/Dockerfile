FROM php:8.2-apache

# Instalar dependencias del sistema operativo
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl

# Limpiar caché para aligerar la imagen
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP que Laravel necesita
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Habilitar las rutas amigables de Apache
RUN a2enmod rewrite

# Apuntar Apache a la carpeta /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar tu código al contenedor
WORKDIR /var/www/html
COPY . .

# Instalar dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Permisos necesarios para que Laravel pueda escribir archivos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80