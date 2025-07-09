#!/bin/bash

echo "Building production ZIP file..."

# Create build directory
rm -rf build
mkdir build

echo "Copying files..."

# Copy essential directories
cp -r app build/
cp -r bootstrap build/
cp -r config build/
cp -r database build/
cp -r public build/
cp -r resources build/
cp -r routes build/
cp -r storage build/
cp -r vendor build/

# Copy root files
cp artisan build/
cp composer.json build/
cp composer.lock build/
cp package.json build/
cp *.md build/ 2>/dev/null || true

# Copy config files
cp .env.example build/
cp vite.config.js build/
cp tailwind.config.js build/
cp postcss.config.js build/
cp tsconfig.json build/
cp phpunit.xml build/

echo "Setting permissions for storage..."
# Create permission script
cat > build/set_permissions.sh << 'EOF'
#!/bin/bash
echo "Setting storage permissions..."
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chmod -R 775 public/storage
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
chown -R www-data:www-data public/storage
echo "Creating storage symlink..."
php artisan storage:link
echo "Permissions set!"
EOF

chmod +x build/set_permissions.sh

echo "Creating ZIP file..."
rm -f berkas-app-production.zip
cd build;  zip -r ../berkas-app-production.zip . ; cd ..

echo "Cleaning up..."
rm -rf build

echo "Done! Production ZIP created: berkas-app-production.zip"
echo ""
echo "Instructions for deployment:"
echo "1. Upload berkas-app-production.zip to your server"
echo "2. Extract the files: unzip berkas-app-production.zip"
echo "3. Run: composer install --no-dev --optimize-autoloader"
echo "4. Run: npm install && npm run build"
echo "5. Copy .env.example to .env and configure database"
echo "6. Run: php artisan key:generate"
echo "7. Run: php artisan migrate"
echo "8. Run: bash set_permissions.sh"
echo "9. Configure your web server to point to public/ directory"
echo ""
echo "Note: The storage:link command will create symlink from public/storage to storage/app/public"
echo "Make sure your server supports symlinks or manually copy files to public/storage"
