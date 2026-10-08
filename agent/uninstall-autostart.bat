@echo off
REM ========================================
REM LabMonitor Agent - Uninstall Auto-Start
REM ========================================

echo.
echo ========================================
echo   LabMonitor Agent - Uninstall Auto-Start
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run this script as Administrator!
    pause
    exit /b 1
)

echo [INFO] Running as Administrator...
echo.

REM ========================================
REM Remove Windows Service
REM ========================================
echo [INFO] Removing Windows Service...

REM Create uninstall script
echo var Service = require('node-windows').Service; > uninstall-service.js
echo var svc = new Service({ >> uninstall-service.js
echo   name: 'LabMonitor Agent' >> uninstall-service.js
echo }); >> uninstall-service.js
echo. >> uninstall-service.js
echo svc.on('uninstall', function(){ >> uninstall-service.js
echo   console.log('Service uninstalled successfully'); >> uninstall-service.js
echo }); >> uninstall-service.js
echo. >> uninstall-service.js
echo svc.uninstall(); >> uninstall-service.js

REM Run uninstaller
if exist "node_modules\node-windows" (
    node uninstall-service.js
    del uninstall-service.js
) else (
    echo [WARNING] node-windows not found, trying manual removal...
    sc delete "LabMonitor Agent" >nul 2>&1
)

echo [OK] Windows Service removed
echo.

REM ========================================
REM Remove Task Scheduler
REM ========================================
echo [INFO] Removing Task Scheduler...
schtasks /delete /tn "LabMonitor Agent" /f >nul 2>&1
echo [OK] Task Scheduler removed
echo.

REM ========================================
REM Remove Startup Folder
REM ========================================
echo [INFO] Removing Startup Folder shortcut...
set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
del "%STARTUP_FOLDER%\LabMonitorAgent.vbs" >nul 2>&1
echo [OK] Startup shortcut removed
echo.

echo ========================================
echo   Auto-Start Uninstalled!
echo ========================================
echo.
echo Agent tidak akan berjalan otomatis lagi saat boot.
echo Untuk menjalankan agent manual:
echo   cd %~dp0
echo   npm start
echo.
pause
