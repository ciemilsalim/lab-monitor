@echo off
REM ========================================
REM LabMonitor Agent - Auto-Start Setup
REM Setup agent untuk berjalan otomatis saat boot
REM ========================================

echo.
echo ========================================
echo   LabMonitor Agent - Auto-Start Setup
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run this script as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo [INFO] Running as Administrator...
echo.

REM Get agent path
set AGENT_PATH=%~dp0
set AGENT_PATH=%AGENT_PATH:~0,-1%

echo [INFO] Agent path: %AGENT_PATH%
echo.

REM ========================================
REM OPTION 1: Install as Windows Service
REM ========================================
echo ========================================
echo   Option 1: Install as Windows Service
echo ========================================
echo.

set /p INSTALL_SERVICE="Install as Windows Service? (Y/N): "
if /i "%INSTALL_SERVICE%"=="Y" (
    echo [INFO] Installing Windows Service...
    
    REM Check if node-windows is installed
    if not exist "node_modules\node-windows" (
        echo [INFO] Installing node-windows...
        call npm install node-windows
    )
    
    REM Create service installer script
    echo var Service = require('node-windows').Service; > install-service.js
    echo var svc = new Service({ >> install-service.js
    echo   name: 'LabMonitor Agent', >> install-service.js
    echo   description: 'LabMonitor Agent - Monitoring dan Remote Control untuk PC Siswa', >> install-service.js
    echo   script: '%AGENT_PATH%\src\agent.js', >> install-service.js
    echo   nodeOptions: ['--harmony'], >> install-service.js
    echo   workingDirectory: '%AGENT_PATH%', >> install-service.js
    echo   allowServiceLogon: true >> install-service.js
    echo }); >> install-service.js
    echo. >> install-service.js
    echo svc.on('install', function(){ >> install-service.js
    echo   svc.start(); >> install-service.js
    echo   console.log('Service installed successfully'); >> install-service.js
    echo }); >> install-service.js
    echo. >> install-service.js
    echo svc.install(); >> install-service.js
    
    REM Run service installer
    node install-service.js
    
    if %errorLevel% neq 0 (
        echo [WARNING] Failed to install as service
        echo Trying alternative method...
    ) else (
        echo [OK] Service installed successfully
        echo [INFO] Agent will start automatically on boot
    )
    
    REM Cleanup
    del install-service.js
)

echo.

REM ========================================
REM OPTION 2: Setup Task Scheduler
REM ========================================
echo ========================================
echo   Option 2: Setup Task Scheduler
echo ========================================
echo.

set /p INSTALL_TASK="Setup Task Scheduler as backup? (Y/N): "
if /i "%INSTALL_TASK%"=="Y" (
    echo [INFO] Creating scheduled task...
    
    REM Delete existing task if exists
    schtasks /delete /tn "LabMonitor Agent" /f >nul 2>&1
    
    REM Create new task
    schtasks /create /tn "LabMonitor Agent" /tr "node.exe \"%AGENT_PATH%\src\agent.js\"" /sc onstart /ru SYSTEM /rl highest /f
    
    if %errorLevel% neq 0 (
        echo [ERROR] Failed to create scheduled task
    ) else (
        echo [OK] Scheduled task created successfully
        echo [INFO] Agent will start automatically on boot via Task Scheduler
    )
)

echo.

REM ========================================
REM OPTION 3: Setup Startup Folder
REM ========================================
echo ========================================
echo   Option 3: Setup Startup Folder
echo ========================================
echo.

set /p INSTALL_STARTUP="Setup Startup Folder as backup? (Y/N): "
if /i "%INSTALL_STARTUP%"=="Y" (
    echo [INFO] Creating startup shortcut...
    
    REM Get startup folder path
    set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
    
    REM Create VBS script to run agent silently
    echo Set WshShell = CreateObject("WScript.Shell") > "%STARTUP_FOLDER%\LabMonitorAgent.vbs"
    echo WshShell.Run "node.exe \"%AGENT_PATH%\src\agent.js\"", 0, False >> "%STARTUP_FOLDER%\LabMonitorAgent.vbs"
    echo Set WshShell = Nothing >> "%STARTUP_FOLDER%\LabMonitorAgent.vbs"
    
    if %errorLevel% neq 0 (
        echo [ERROR] Failed to create startup shortcut
    ) else (
        echo [OK] Startup shortcut created successfully
        echo [INFO] Agent will start automatically on user login
    )
)

echo.

REM ========================================
REM SUMMARY
REM ========================================
echo ========================================
echo   Auto-Start Setup Complete!
echo ========================================
echo.
echo Agent akan berjalan otomatis saat komputer boot melalui:
echo.
if /i "%INSTALL_SERVICE%"=="Y" echo [OK] Windows Service (Primary)
if /i "%INSTALL_TASK%"=="Y" echo [OK] Task Scheduler (Backup)
if /i "%INSTALL_STARTUP%"=="Y" echo [OK] Startup Folder (Backup)
echo.
echo Untuk memeriksa status service:
echo   1. Tekan Win + R
echo   2. Ketik: services.msc
echo   3. Cari: "LabMonitor Agent"
echo   4. Status harus: "Running"
echo   5. Startup Type: "Automatic"
echo.
echo Untuk uninstall auto-start:
echo   1. Run: uninstall-autostart.bat
echo.
pause
