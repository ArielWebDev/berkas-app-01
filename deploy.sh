#!/bin/bash

echo "Laravel Deployment Setup Script"
echo "==============================="

# 1. Install dependencies
echo "1. Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# 2. Install and build frontend assets
echo "2. Building frontend assets..."
npm install
npm run build

# 3. Setup environment
echo "3. Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please edit .env file with your database and app settings"
    read -p "Press Enter to continue after editing .env..."
fi

# 4. Generate app key
echo "4. Generating application key..."
php artisan key:generate

# 5. Clear and cache config
echo "5. Optimizing configuration..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Run migrations
echo "6. Running database migrations..."
php artisan migrate --force

# 7. Create storage symlink
echo "7. Creating storage symlink..."
php artisan storage:link

# 8. Set permissions
echo "8. Setting file permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chmod -R 775 public/storage

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    chown -R www-data:www-data storage
    chown -R www-data:www-data bootstrap/cache
    chown -R www-data:www-data public/storage
    echo "Ownership set to www-data"
else
    echo "Note: Run with sudo to set www-data ownership"
    echo "sudo chown -R www-data:www-data storage bootstrap/cache public/storage"
fi

# 9. Test storage write permissions
echo "9. Testing storage permissions..."
php -r "
try {
    file_put_contents('storage/logs/deployment-test.log', 'Test write: ' . date('Y-m-d H:i:s') . PHP_EOL);
    echo 'Storage write test: SUCCESS' . PHP_EOL;
    unlink('storage/logs/deployment-test.log');
} catch (Exception \$e) {
    echo 'Storage write test: FAILED - ' . \$e->getMessage() . PHP_EOL;
}
"

echo ""
echo "Deployment completed!"
echo ""
echo "Important reminders:"
echo "==================="
echo "1. Make sure your web server points to the 'public' directory"
echo "2. Ensure your .env file has correct database settings"
echo "3. Check that storage and bootstrap/cache folders are writable"
echo "4. Test file upload functionality after deployment"
echo ""
echo "Common web server document root:"
echo "Apache: /var/www/html/your-app/public"
echo "Nginx: /var/www/your-app/public"
