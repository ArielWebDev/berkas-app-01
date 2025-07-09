@echo off
echo Building production ZIP file with ALL uploaded files (using 7-Zip)...

:: Check if 7-Zip is available
set SEVENZIP=
if exist "C:\Program Files\7-Zip\7z.exe" set SEVENZIP=C:\Program Files\7-Zip\7z.exe
if exist "C:\Program Files (x86)\7-Zip\7z.exe" set SEVENZIP=C:\Program Files (x86)\7-Zip\7z.exe

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

if defined SEVENZIP (
    echo Using 7-Zip to create archive...
    "%SEVENZIP%" a -tzip "berkas-app-production-with-uploads.zip" "build\*" -r
    set ZIP_SUCCESS=%ERRORLEVEL%
) else (
    echo 7-Zip not found, trying alternate method...
    where tar >nul 2>&1
    if %ERRORLEVEL% == 0 (
        echo Using tar to create archive...
        cd build
        tar -czf "..\berkas-app-production-with-uploads.tar.gz" *
        cd ..
        echo Created berkas-app-production-with-uploads.tar.gz instead of ZIP
        set ZIP_SUCCESS=0
    ) else (
        echo Creating ZIP with basic method (may fail on long filenames)...
        powershell -Command "try { Compress-Archive -Path 'build\*' -DestinationPath 'berkas-app-production-with-uploads.zip' -Force; exit 0 } catch { exit 1 }"
        set ZIP_SUCCESS=%ERRORLEVEL%
    )
)

if %ZIP_SUCCESS% == 0 (
    if exist "berkas-app-production-with-uploads.zip" (
        echo SUCCESS: Production ZIP created as berkas-app-production-with-uploads.zip
    ) else if exist "berkas-app-production-with-uploads.tar.gz" (
        echo SUCCESS: Production archive created as berkas-app-production-with-uploads.tar.gz
    ) else (
        echo WARNING: Archive creation completed but file not found
    )
    echo.
    echo Archive Contents Summary:
    echo - All source code
    echo - All vendor dependencies 
    echo - ALL uploaded files from public/storage
    echo - Storage structure with proper permissions
    echo - Deployment scripts
    echo.
    echo File size:
    if exist "berkas-app-production-with-uploads.zip" dir "berkas-app-production-with-uploads.zip"
    if exist "berkas-app-production-with-uploads.tar.gz" dir "berkas-app-production-with-uploads.tar.gz"
    echo.
    echo Note: This archive includes ALL uploaded files. 
    echo For deployment without uploads, use build-without-uploads.bat instead.
) else (
    echo ERROR: Failed to create archive
    exit /b 1
)

echo Build completed!
pause
