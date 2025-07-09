@echo off
echo Building production ZIP file...

:: Create build directory with force
if exist "build" (
    echo Removing existing build directory...
    rmdir /s /q build 2>nul
    timeout /t 2 /nobreak > nul
)
mkdir build

echo Copying files...

:: Use robocopy for better handling of file permissions
echo Copying app...
robocopy app build\app /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying bootstrap...
robocopy bootstrap build\bootstrap /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying config...
robocopy config build\config /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying database...
robocopy database build\database /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying public...
robocopy public build\public /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying resources...
robocopy resources build\resources /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying routes...
robocopy routes build\routes /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying storage...
robocopy storage build\storage /E /R:2 /W:1 /NFL /NDL /NJH /NJS

:: Copy vendor with special handling (skip if problematic)
echo Copying vendor (this may take a while)...
robocopy vendor build\vendor /E /R:1 /W:1 /NFL /NDL /NJH /NJS /XD node_modules .git

:: Copy root files
echo Copying root files...
copy /y artisan build\ >nul 2>&1
copy /y composer.json build\ >nul 2>&1
copy /y composer.lock build\ >nul 2>&1
copy /y package.json build\ >nul 2>&1

:: Copy documentation files
for %%f in (*.md) do copy /y "%%f" build\ >nul 2>&1

:: Copy config files
copy /y .env.example build\ >nul 2>&1
copy /y vite.config.js build\ >nul 2>&1
copy /y tailwind.config.js build\ >nul 2>&1
copy /y postcss.config.js build\ >nul 2>&1
copy /y tsconfig.json build\ >nul 2>&1
copy /y phpunit.xml build\ >nul 2>&1

echo Setting permissions for storage...
:: Set storage permissions (for Linux/production)
echo echo "Setting storage permissions..." > build\set_permissions.sh
echo chmod -R 775 storage >> build\set_permissions.sh
echo chmod -R 775 bootstrap/cache >> build\set_permissions.sh
echo chmod -R 775 public/storage >> build\set_permissions.sh
echo chown -R www-data:www-data storage >> build\set_permissions.sh
echo chown -R www-data:www-data bootstrap/cache >> build\set_permissions.sh
echo chown -R www-data:www-data public/storage >> build\set_permissions.sh
echo echo "Creating storage symlink..." >> build\set_permissions.sh
echo php artisan storage:link >> build\set_permissions.sh

echo Creating ZIP file...
if exist "berkas-app-production.zip" del "berkas-app-production.zip"

:: Try using 7zip first (if available), then fallback to PowerShell
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    echo Using 7-Zip...
    7z a -tzip berkas-app-production.zip build\*
) else (
    echo Using PowerShell Compress-Archive...
    :: Use PowerShell with better error handling
    powershell -Command "try { Compress-Archive -Path 'build\*' -DestinationPath 'berkas-app-production.zip' -Force; Write-Host 'ZIP created successfully' } catch { Write-Host 'ZIP creation failed:' $_.Exception.Message }"
)

echo Cleaning up...
:: Force remove build directory
rmdir /s /q build 2>nul
if exist "build" (
    echo Some files couldn't be deleted automatically. Please delete build folder manually.
    echo This doesn't affect the ZIP file creation.
)

echo Done! Production ZIP created: berkas-app-production.zip
echo.
echo Instructions for deployment:
echo 1. Upload berkas-app-production.zip to your server
echo 2. Extract the files
echo 3. Run: composer install --no-dev --optimize-autoloader
echo 4. Run: npm install ^&^& npm run build
echo 5. Copy .env.example to .env and configure database
echo 6. Run: php artisan key:generate
echo 7. Run: php artisan migrate
echo 8. Run: bash set_permissions.sh (on Linux)
echo 9. Configure your web server to point to public/ directory
echo.
echo Note: The storage:link command will create symlink from public/storage to storage/app/public
echo Make sure your server supports symlinks or manually copy files to public/storage

pause
