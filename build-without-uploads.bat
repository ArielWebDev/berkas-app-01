@echo off
echo Building production ZIP file WITHOUT uploaded files...

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

:: Copy public but EXCLUDE the storage folder entirely
echo Copying public (excluding storage)...
robocopy public build\public /E /R:2 /W:1 /NFL /NDL /NJH /NJS /XD storage

:: Create empty storage structure in public for symlink
echo Creating empty storage structure...
mkdir build\public\storage
mkdir build\public\storage\berkas_pinjaman
mkdir build\public\storage\berkas-pinjaman
echo. > build\public\storage\.gitkeep
echo. > build\public\storage\.gitignore
echo. > build\public\storage\berkas_pinjaman\.gitkeep
echo. > build\public\storage\berkas-pinjaman\.gitkeep

:: Add .gitignore content
echo *> build\public\storage\.gitignore
echo !.gitignore>> build\public\storage\.gitignore
echo !.gitkeep>> build\public\storage\.gitignore

echo Copying resources...
robocopy resources build\resources /E /R:2 /W:1 /NFL /NDL /NJH /NJS
echo Copying routes...
robocopy routes build\routes /E /R:2 /W:1 /NFL /NDL /NJH /NJS

:: Copy storage but exclude uploaded files
echo Copying storage structure (without uploaded files)...
robocopy storage build\storage /E /R:2 /W:1 /NFL /NDL /NJH /NJS /XD public

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
if exist "berkas-app-production-clean.zip" del "berkas-app-production-clean.zip"

:: Use PowerShell to create ZIP
powershell -Command "Compress-Archive -Path 'build\*' -DestinationPath 'berkas-app-production-clean.zip' -Force"

if exist "berkas-app-production-clean.zip" (
    echo SUCCESS: Clean production ZIP created as berkas-app-production-clean.zip
    echo.
    echo ZIP Contents Summary:
    echo - All source code
    echo - All vendor dependencies 
    echo - Empty storage structure (NO uploaded files)
    echo - Storage folders with .gitkeep files
    echo - Deployment scripts
    echo.
    echo File size:
    dir "berkas-app-production-clean.zip"
    echo.
    echo Note: This ZIP excludes uploaded files for clean deployment.
    echo Use build-with-uploads.bat to include existing uploads.
) else (
    echo ERROR: Failed to create ZIP file
    exit /b 1
)

echo Build completed!
pause
