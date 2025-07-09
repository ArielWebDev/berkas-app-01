@echo off
echo Building production ZIP file with ALL uploaded files...

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

:: Copy public but EXCLUDE the symlink storage folder first
echo Copying public (excluding storage symlink)...
robocopy public build\public /E /R:2 /W:1 /NFL /NDL /NJH /NJS /XD storage

:: Now explicitly copy the REAL storage files from public\storage
echo Copying uploaded files from public\storage...
if exist "public\storage" (
    robocopy public\storage build\public\storage /E /R:2 /W:1 /NFL /NDL /NJH /NJS
) else (
    echo Warning: public\storage not found, creating empty structure...
    mkdir build\public\storage
    mkdir build\public\storage\berkas_pinjaman
    mkdir build\public\storage\berkas-pinjaman
    echo. > build\public\storage\.gitkeep
    echo. > build\public\storage\berkas_pinjaman\.gitkeep
    echo. > build\public\storage\berkas-pinjaman\.gitkeep
)

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

:: Copy deployment scripts
copy /y deploy.sh build\ >nul 2>&1
copy /y deploy-light.sh build\ >nul 2>&1
copy /y test-storage.php build\ >nul 2>&1

:: Ensure proper permissions for storage
echo Setting storage permissions...
cd build
if exist storage (
    attrib -r storage\* /s /d
    attrib -r storage /s /d
)

:: Create .env file from example
if not exist .env (
    echo Creating .env from example...
    copy /y .env.example .env >nul 2>&1
)

cd ..

:: Create ZIP file
echo Creating ZIP file...
if exist "berkas-app-production-with-uploads.zip" del "berkas-app-production-with-uploads.zip"

:: Use PowerShell to create ZIP
powershell -Command "Compress-Archive -Path 'build\*' -DestinationPath 'berkas-app-production-with-uploads.zip' -Force"

if exist "berkas-app-production-with-uploads.zip" (
    echo SUCCESS: Production ZIP created as berkas-app-production-with-uploads.zip
    echo.
    echo ZIP Contents Summary:
    echo - All source code
    echo - All vendor dependencies 
    echo - ALL uploaded files from public/storage
    echo - Storage structure with proper permissions
    echo - Deployment scripts
    echo.
    echo File size:
    dir "berkas-app-production-with-uploads.zip"
    echo.
    echo Note: This ZIP includes ALL uploaded files. 
    echo For deployment without uploads, use build-clean.bat instead.
) else (
    echo ERROR: Failed to create ZIP file
    exit /b 1
)

echo Build completed!
pause
