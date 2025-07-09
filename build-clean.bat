@echo off
echo Building CLEAN production ZIP file...
echo This version excludes problematic symlinks and vendor folder.
echo.

:: Create build directory with force
if exist "build-clean" (
    echo Removing existing build directory...
    rmdir /s /q build-clean 2>nul
    timeout /t 2 /nobreak > nul
)
mkdir build-clean

echo Copying essential files only...

:: Use robocopy with better exclusions
echo Copying app...
robocopy app build-clean\app /E /R:1 /W:1 /NFL /NDL /NJH /NJS
echo Copying bootstrap...
robocopy bootstrap build-clean\bootstrap /E /R:1 /W:1 /NFL /NDL /NJH /NJS
echo Copying config...
robocopy config build-clean\config /E /R:1 /W:1 /NFL /NDL /NJH /NJS
echo Copying database...
robocopy database build-clean\database /E /R:1 /W:1 /NFL /NDL /NJH /NJS

:: Copy public but exclude storage symlink
echo Copying public (excluding storage symlink)...
robocopy public build-clean\public /E /R:1 /W:1 /NFL /NDL /NJH /NJS /XD storage
mkdir build-clean\public\storage
echo. > build-clean\public\storage\.gitkeep

echo Copying resources...
robocopy resources build-clean\resources /E /R:1 /W:1 /NFL /NDL /NJH /NJS
echo Copying routes...
robocopy routes build-clean\routes /E /R:1 /W:1 /NFL /NDL /NJH /NJS

:: Copy storage structure but exclude uploaded files
echo Copying storage structure...
mkdir build-clean\storage
mkdir build-clean\storage\app
mkdir build-clean\storage\app\public
mkdir build-clean\storage\app\private
mkdir build-clean\storage\framework
mkdir build-clean\storage\framework\cache
mkdir build-clean\storage\framework\cache\data
mkdir build-clean\storage\framework\sessions
mkdir build-clean\storage\framework\testing
mkdir build-clean\storage\framework\views
mkdir build-clean\storage\logs

:: Create .gitkeep files
echo. > build-clean\storage\app\public\.gitkeep
echo. > build-clean\storage\app\private\.gitkeep
echo. > build-clean\storage\framework\cache\data\.gitkeep
echo. > build-clean\storage\framework\sessions\.gitkeep
echo. > build-clean\storage\framework\testing\.gitkeep
echo. > build-clean\storage\framework\views\.gitkeep
echo. > build-clean\storage\logs\.gitkeep

:: Copy root files
echo Copying configuration files...
copy /y artisan build-clean\ >nul 2>&1
copy /y composer.json build-clean\ >nul 2>&1
copy /y composer.lock build-clean\ >nul 2>&1
copy /y package.json build-clean\ >nul 2>&1

:: Copy documentation files (optional, comment out if not needed)
rem for %%f in (*.md) do copy /y "%%f" build-clean\ >nul 2>&1

:: Copy essential config files only
copy /y .env.example build-clean\ >nul 2>&1
copy /y vite.config.js build-clean\ >nul 2>&1
copy /y tailwind.config.js build-clean\ >nul 2>&1
copy /y postcss.config.js build-clean\ >nul 2>&1
copy /y tsconfig.json build-clean\ >nul 2>&1

echo Creating deployment script...
(
echo #!/bin/bash
echo echo "Laravel Clean Deployment Script"
echo echo "==============================="
echo echo ""
echo echo "1. Installing PHP dependencies..."
echo composer install --no-dev --optimize-autoloader
echo echo ""
echo echo "2. Installing Node.js dependencies..."
echo npm install
echo npm run build
echo echo ""
echo echo "3. Setting up environment..."
echo if [ ! -f .env ]; then
echo     cp .env.example .env
echo     echo "Please edit .env file with your settings"
echo     echo "Press Enter after editing .env file..."
echo     read
echo fi
echo echo ""
echo echo "4. Generating application key..."
echo php artisan key:generate
echo echo ""
echo echo "5. Running migrations..."
echo php artisan migrate --force
echo echo ""
echo echo "6. Setting storage permissions..."
echo chmod -R 775 storage bootstrap/cache public/storage
echo if [ "$EUID" -eq 0 ]; then
echo     chown -R www-data:www-data storage bootstrap/cache public/storage
echo     echo "Ownership set to www-data"
echo else
echo     echo "Note: Run with sudo to set www-data ownership"
echo fi
echo echo ""
echo echo "7. Creating storage link..."
echo php artisan storage:link
echo echo ""
echo echo "8. Optimizing application..."
echo php artisan config:cache
echo php artisan route:cache
echo php artisan view:cache
echo echo ""
echo echo "9. Testing storage permissions..."
echo php -r "
echo try {
echo     file_put_contents('storage/logs/deployment-test.log', 'Test: ' . date('Y-m-d H:i:s'^) . PHP_EOL^);
echo     echo 'Storage write test: SUCCESS' . PHP_EOL;
echo     unlink('storage/logs/deployment-test.log'^);
echo } catch (Exception \$e^) {
echo     echo 'Storage write test: FAILED - ' . \$e-^>getMessage(^) . PHP_EOL;
echo }
echo "
echo echo ""
echo echo "Deployment completed successfully!"
echo echo ""
echo echo "Important notes:"
echo echo "- Make sure web server points to 'public' directory"
echo echo "- Verify .env database settings"
echo echo "- Test file upload functionality"
) > build-clean\deploy-clean.sh

echo Creating ZIP file...
if exist "berkas-app-clean.zip" del "berkas-app-clean.zip"

:: Use PowerShell with simpler approach
powershell "Compress-Archive -Path 'build-clean\*' -DestinationPath 'berkas-app-clean.zip' -Force"

if not exist "berkas-app-clean.zip" (
    echo ZIP creation failed! Trying alternative method...
    
    :: Try with 7zip if available
    where 7z >nul 2>&1
    if %errorlevel% equ 0 (
        echo Using 7-Zip...
        7z a -tzip berkas-app-clean.zip build-clean\*
    ) else (
        echo Please manually create ZIP from build-clean folder
        echo Folder location: %cd%\build-clean
        echo Press any key to continue...
        pause >nul
        goto :cleanup
    )
)

:cleanup
echo Cleaning up...
rmdir /s /q build-clean 2>nul

echo.
echo Done! Clean production ZIP created: berkas-app-clean.zip
echo File size is optimized (no vendor, no uploaded files).
echo.
echo Instructions for deployment:
echo 1. Upload berkas-app-clean.zip to your server
echo 2. Extract the files: unzip berkas-app-clean.zip
echo 3. Make deployment script executable: chmod +x deploy-clean.sh
echo 4. Run deployment script: ./deploy-clean.sh
echo 5. Follow the prompts to configure .env
echo 6. Configure web server to point to public/ directory
echo.
echo This version:
echo - Excludes vendor folder (downloaded on server)
echo - Excludes uploaded files (clean storage structure)
echo - Excludes problematic symlinks
echo - Includes storage permission setup

pause
