@echo off
REM ========================================
REM LabMonitor Backend - One-Click Deploy
REM File: ONE-CLICK-DEPLOY.bat
REM 
REM CARA PAKAI:
REM 1. Double-click file ini
REM 2. Tunggu proses selesai
REM 3. Backend siap digunakan!
REM ========================================

color 0B
title LabMonitor Backend - One-Click Deploy

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     LabMonitor Backend - One-Click Deploy                 ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Get current directory
set CURRENT_DIR=%~dp0
set CURRENT_DIR=%CURRENT_DIR:~0,-1%

echo [INFO] Current directory: %CURRENT_DIR%
echo.

REM ========================================
REM STEP 1: Check if running from correct location
REM ========================================
echo [STEP 1/6] Checking deployment location...

if not exist "%CURRENT_DIR%\package.json" (
    color 0C
    echo [ERROR] package.json not found!
    echo.
    echo Please run this script from the backend folder.
    echo Expected location: agent\backend\ONE-CLICK-DEPLOY.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Deployment location verified
echo.

REM ========================================
REM STEP 2: Ask for target directory
REM ========================================
echo [STEP 2/6] Setting up target directory...
echo.
echo Where do you want to deploy the backend?
echo.
echo Default: D:\labmonitor-backend
echo.
set /p TARGET_DIR="Enter target directory (or press Enter for default): "

if "%TARGET_DIR%"=="" set TARGET_DIR=D:\labmonitor-backend

echo.
echo [INFO] Target directory: %TARGET_DIR%
echo.

REM ========================================
REM STEP 3: Copy files
REM ========================================
echo [STEP 3/6] Copying files to %TARGET_DIR%...

if not exist "%TARGET_DIR%" (
    mkdir "%TARGET_DIR%"
    echo [OK] Created directory: %TARGET_DIR%
)

REM Copy all files
xcopy "%CURRENT_DIR%\*" "%TARGET_DIR%\" /E /I /Y /Q >nul 2>&1

if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Failed to copy files!
    echo.
    echo Please check if you have write permissions to %TARGET_DIR%
    echo.
    pause
    exit /b 1
)

echo [OK] Files copied successfully
echo.

REM ========================================
REM STEP 4: Install dependencies
REM ========================================
echo [STEP 4/6] Installing dependencies...
echo.

cd /d "%TARGET_DIR%"

call npm install >nul 2>&1

if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Failed to install dependencies!
    echo.
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM ========================================
REM STEP 5: Setup .env file
REM ========================================
echo [STEP 5/6] Setting up environment configuration...

if not exist "%TARGET_DIR%\.env" (
    copy "%TARGET_DIR%\.env.example" "%TARGET_DIR%\.env" >nul 2>&1
    echo [OK] Created .env file from template
    echo.
    echo [WARNING] Please edit .env file with your configuration!
    echo.
    echo Open: %TARGET_DIR%\.env
    echo.
    echo Required changes:
    echo   - JWT_SECRET (change to random string)
    echo   - CORS_ORIGIN (set to your frontend URL)
    echo   - CORS_ORIGIN_NETWORK (set to your network IP)
    echo.
    pause
) else (
    echo [OK] .env file already exists
)

echo.

REM ========================================
REM STEP 6: Final verification
REM ========================================
echo [STEP 6/6] Verifying deployment...

REM Check critical files
if not exist "%TARGET_DIR%\src\server.js" (
    color 0C
    echo [ERROR] server.js not found!
    pause
    exit /b 1
)

if not exist "%TARGET_DIR%\src\config\database.js" (
    color 0C
    echo [ERROR] database.js not found!
    pause
    exit /b 1
)

if not exist "%TARGET_DIR%\src\services\alertEngine.js" (
    color 0C
    echo [ERROR] alertEngine.js not found!
    pause
    exit /b 1
)

if not exist "%TARGET_DIR%\database\schema.sql" (
    color 0C
    echo [ERROR] schema.sql not found!
    pause
    exit /b 1
)

echo [OK] All critical files verified
echo.

REM ========================================
REM DEPLOYMENT COMPLETE
REM ========================================
color 0A
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              DEPLOYMENT COMPLETE!                         ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Backend deployed to: %TARGET_DIR%
echo.
echo Next steps:
echo ────────────────────────────────────────────────────────────
echo   1. Edit .env file: %TARGET_DIR%\.env
echo   2. Setup database: Import database\schema.sql in phpMyAdmin
echo   3. Start backend:  cd %TARGET_DIR% ^&^& npm run dev
echo   4. Test backend:   curl http://localhost:3001/health
echo ────────────────────────────────────────────────────────────
echo.
echo Quick start command:
echo ────────────────────────────────────────────────────────────
echo   cd %TARGET_DIR%
echo   npm run dev
echo ────────────────────────────────────────────────────────────
echo.
echo Documentation:
echo ────────────────────────────────────────────────────────────
echo   - START-HERE.md      (Quick start)
echo   - QUICK-DEPLOY.md    (Detailed guide)
echo   - VISUAL-GUIDE.md    (Visual diagrams)
echo   - README.md          (Full documentation)
echo ────────────────────────────────────────────────────────────
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Press any key to open target folder...
pause >nul

REM Open target folder in Explorer
explorer "%TARGET_DIR%"

echo.
echo Deployment complete! You can now start the backend.
echo.
pause
