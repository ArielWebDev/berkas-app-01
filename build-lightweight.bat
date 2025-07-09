@echo off
echo Building LIGHTWEIGHT production ZIP file (without vendor)...
echo This version will download dependencies on the server to avoid permission issues.
echo.

:: Create build directory with force
if exist "build-light" (
    echo Removing existing build directory...
    rmdir /s /q build-light 2>nul
    timeout /t 2 /nobreak > nul
)
mkdir build-light

echo Copying essential files only (no vendor)...

:: Use robocopy for better handling
echo Copying app...
robocopy app build-light\app /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying bootstrap...
robocopy bootstrap build-light\bootstrap /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying config...
robocopy config build-light\config /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying database...
robocopy database build-light\database /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying public...
robocopy public build-light\public /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying resources...
robocopy resources build-light\resources /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying routes...
robocopy routes build-light\routes /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying storage...
robocopy storage build-light\storage /E /R:2 /W:1 /NFL /NDL /NJH /NJS

:: Copy root files
echo Copying configuration files...
copy /y artisan build-light\ >nul 2>&1
copy /y composer.json build-light\ >nul 2>&1
copy /y composer.lock build-light\ >nul 2>&1
copy /y package.json build-light\ >nul 2>&1

:: Copy documentation files
for %%f in (*.md) do copy /y "%%f" build-light\ >nul 2>&1

:: Copy config files
copy /y .env.example build-light\ >nul 2>&1
copy /y vite.config.js build-light\ >nul 2>&1
copy /y tailwind.config.js build-light\ >nul 2>&1
copy /y postcss.config.js build-light\ >nul 2>&1
copy /y tsconfig.json build-light\ >nul 2>&1
copy /y phpunit.xml build-light\ >nul 2>&1

echo Setting permissions for storage...
:: Create enhanced deployment script
echo echo "Laravel Lightweight Deployment Script" > build-light\deploy-light.sh
echo echo "=====================================" >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "1. Installing PHP dependencies..." >> build-light\deploy-light.sh
echo composer install --no-dev --optimize-autoloader >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "2. Installing Node.js dependencies..." >> build-light\deploy-light.sh
echo npm install >> build-light\deploy-light.sh
echo npm run build >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "3. Setting up environment..." >> build-light\deploy-light.sh
echo if [ ! -f .env ]; then >> build-light\deploy-light.sh
echo     cp .env.example .env >> build-light\deploy-light.sh
echo     echo "Please edit .env file with your settings" >> build-light\deploy-light.sh
echo fi >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "4. Generating application key..." >> build-light\deploy-light.sh
echo php artisan key:generate >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "5. Running migrations..." >> build-light\deploy-light.sh
echo php artisan migrate --force >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "6. Setting storage permissions..." >> build-light\deploy-light.sh
echo chmod -R 775 storage bootstrap/cache public/storage >> build-light\deploy-light.sh
echo chown -R www-data:www-data storage bootstrap/cache public/storage >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "7. Creating storage link..." >> build-light\deploy-light.sh
echo php artisan storage:link >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "8. Optimizing application..." >> build-light\deploy-light.sh
echo php artisan config:cache >> build-light\deploy-light.sh
echo php artisan route:cache >> build-light\deploy-light.sh
echo php artisan view:cache >> build-light\deploy-light.sh
echo echo "" >> build-light\deploy-light.sh
echo echo "Deployment completed successfully!" >> build-light\deploy-light.sh

echo Creating ZIP file...
if exist "berkas-app-lightweight.zip" del "berkas-app-lightweight.zip"

:: Try using 7zip first, then fallback to PowerShell
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    echo Using 7-Zip...
    7z a -tzip berkas-app-lightweight.zip build-light\*
) else (
    echo Using PowerShell Compress-Archive...
    powershell -Command "try { Compress-Archive -Path 'build-light\*' -DestinationPath 'berkas-app-lightweight.zip' -Force; Write-Host 'ZIP created successfully' } catch { Write-Host 'ZIP creation failed:' $_.Exception.Message }"
)

echo Cleaning up...
rmdir /s /q build-light 2>nul

echo Done! Lightweight production ZIP created: berkas-app-lightweight.zip
echo File size is much smaller because vendor folder is excluded.
echo.
echo Instructions for deployment:
echo 1. Upload berkas-app-lightweight.zip to your server
echo 2. Extract the files: unzip berkas-app-lightweight.zip
echo 3. Make deployment script executable: chmod +x deploy-light.sh
echo 4. Run deployment script: ./deploy-light.sh
echo 5. Edit .env file with your database settings
echo 6. Configure web server to point to public/ directory
echo.
echo This method downloads dependencies on the server, avoiding Windows permission issues.

pause
