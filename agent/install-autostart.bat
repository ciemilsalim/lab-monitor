@echo off
REM ========================================
REM LabMonitor Agent - Auto-Start Installer
REM File: install-autostart.bat
REM 
REM Cara Pakai:
REM 1. Right-click file ini
REM 2. Pilih "Run as administrator"
REM 3. Tunggu sampai selesai
REM ========================================

color 0A
title LabMonitor Agent - Auto-Start Installer

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     LabMonitor Agent - Auto-Start Installer               ║
echo ║                                                            ║
echo ║     Setup agent untuk berjalan otomatis saat boot         ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ========================================
REM CHECK ADMINISTRATOR PRIVILEGES
REM ========================================
net session >nul 2>&1
if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Script ini harus dijalankan sebagai Administrator!
    echo.
    echo Cara menjalankan:
    echo   1. Right-click file install-autostart.bat
    echo   2. Pilih "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [OK] Running as Administrator
echo.

REM ========================================
REM GET AGENT PATH
REM ========================================
set AGENT_PATH=%~dp0
set AGENT_PATH=%AGENT_PATH:~0,-1%

echo [INFO] Agent path: %AGENT_PATH%
echo.

REM ========================================
REM CHECK NODE.JS
REM ========================================
echo [CHECK] Checking Node.js installation...
where node >nul 2>&1
if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Node.js tidak ditemukan!
    echo.
    echo Silakan install Node.js terlebih dahulu:
    echo   1. Download dari: https://nodejs.org/
    echo   2. Pilih versi LTS (Long Term Support)
    echo   3. Install dengan default settings
    echo   4. Restart komputer
    echo   5. Jalankan installer ini lagi
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%
echo.

REM ========================================
REM CHECK AGENT FILES
REM ========================================
echo [CHECK] Checking agent files...

if not exist "%AGENT_PATH%\src\agent.js" (
    color 0C
    echo [ERROR] File agent.js tidak ditemukan!
    echo.
    echo Pastikan file agent.js ada di:
    echo   %AGENT_PATH%\src\agent.js
    echo.
    pause
    exit /b 1
)

echo [OK] Agent files found
echo.

REM ========================================
REM CHECK DEPENDENCIES
REM ========================================
echo [CHECK] Checking dependencies...

if not exist "%AGENT_PATH%\node_modules" (
    echo [INFO] Installing dependencies...
    cd /d "%AGENT_PATH%"
    call npm install
    if %errorLevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)
echo.

REM ========================================
REM DELETE EXISTING TASK
REM ========================================
echo [SETUP] Removing old task (if exists)...
schtasks /delete /tn "LabMonitor Agent" /f >nul 2>&1
echo [OK] Old task removed
echo.

REM ========================================
REM CREATE SCHEDULED TASK
REM ========================================
echo [SETUP] Creating scheduled task...
echo.

REM Get node.exe full path
for /f "tokens=*" %%i in ('where node') do set NODE_PATH=%%i

echo [INFO] Node path: %NODE_PATH%
echo [INFO] Agent script: %AGENT_PATH%\src\agent.js
echo.

REM Create task with all necessary settings
schtasks /create ^
    /tn "LabMonitor Agent" ^
    /tr "\"%NODE_PATH%\" \"%AGENT_PATH%\src\agent.js\"" ^
    /sc onstart ^
    /ru SYSTEM ^
    /rl highest ^
    /delay 0000:30 ^
    /f

if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Failed to create scheduled task!
    echo.
    echo Error code: %errorLevel%
    echo.
    pause
    exit /b 1
)

echo [OK] Scheduled task created successfully
echo.

REM ========================================
REM CONFIGURE TASK SETTINGS
REM ========================================
echo [SETUP] Configuring task settings...

REM Set task to run whether user is logged on or not
schtasks /change /tn "LabMonitor Agent" /ru SYSTEM >nul 2>&1

REM Set task to restart on failure
schtasks /change /tn "LabMonitor Agent" /ri 1 /k >nul 2>&1

echo [OK] Task settings configured
echo.

REM ========================================
REM TEST TASK
REM ========================================
echo [TEST] Testing scheduled task...

schtasks /run /tn "LabMonitor Agent" >nul 2>&1

REM Wait 3 seconds for task to start
timeout /t 3 /nobreak >nul

REM Check if task is running
schtasks /query /tn "LabMonitor Agent" /fo list | findstr "Status" >nul 2>&1
if %errorLevel% neq 0 (
    color 0E
    echo [WARNING] Task created but may not be running
    echo.
    echo You can check manually:
    echo   1. Open Task Scheduler (taskschd.msc)
    echo   2. Find "LabMonitor Agent"
    echo   3. Right-click and select "Run"
    echo.
) else (
    echo [OK] Task is running
)
echo.

REM ========================================
REM VERIFY AGENT PROCESS
REM ========================================
echo [VERIFY] Checking agent process...

timeout /t 2 /nobreak >nul

tasklist | findstr "node.exe" >nul 2>&1
if %errorLevel% neq 0 (
    color 0E
    echo [WARNING] Agent process not detected yet
    echo.
    echo Agent might need a few seconds to start.
    echo You can check manually:
    echo   tasklist ^| findstr node
    echo.
) else (
    echo [OK] Agent process is running
)
echo.

REM ========================================
REM CHECK AGENT LOG
REM ========================================
echo [VERIFY] Checking agent log...

if exist "%AGENT_PATH%\logs\agent.log" (
    echo.
    echo Last 5 lines from agent.log:
    echo ────────────────────────────────────────
    powershell -Command "Get-Content '%AGENT_PATH%\logs\agent.log' -Tail 5"
    echo ────────────────────────────────────────
    echo.
) else (
    echo [INFO] Log file not created yet (normal for first run)
    echo.
)

REM ========================================
REM CREATE UNINSTALLER
REM ========================================
echo [SETUP] Creating uninstaller...

(
echo @echo off
echo REM LabMonitor Agent - Uninstaller
echo color 0A
echo title LabMonitor Agent - Uninstaller
echo echo.
echo echo ╔════════════════════════════════════════════════════════════╗
echo echo ║                                                            ║
echo echo ║     LabMonitor Agent - Uninstaller                        ║
echo echo ║                                                            ║
echo echo ╚════════════════════════════════════════════════════════════╝
echo echo.
echo net session ^>nul 2^>^&1
echo if %%errorLevel%% neq 0 ^(
echo     color 0C
echo     echo [ERROR] Please run as Administrator!
echo     pause
echo     exit /b 1
echo ^)
echo echo [INFO] Removing scheduled task...
echo schtasks /delete /tn "LabMonitor Agent" /f ^>nul 2^>^&1
echo echo [OK] Scheduled task removed
echo echo.
echo echo ════════════════════════════════════════════════════════════
echo echo.
echo echo Uninstall complete!
echo echo.
echo pause
) > "%AGENT_PATH%\uninstall-autostart.bat"

echo [OK] Uninstaller created: uninstall-autostart.bat
echo.

REM ========================================
REM SUMMARY
REM ========================================
color 0A
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              INSTALLATION COMPLETE!                       ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Agent Configuration:
echo ────────────────────────────────────────────────────────────
echo   Task Name:      LabMonitor Agent
echo   Trigger:        On computer startup
echo   Run as:         SYSTEM (Full Administrator)
echo   Auto-restart:   Yes (on failure)
echo   Delay:          30 seconds after boot
echo ────────────────────────────────────────────────────────────
echo.
echo What happens now:
echo ────────────────────────────────────────────────────────────
echo   ✓ Agent will start automatically when computer boots
echo   ✓ Agent runs in background (no window)
echo   ✓ Agent connects to server automatically
echo   ✓ Agent auto-reconnects if connection lost
echo   ✓ Agent auto-restarts if it crashes
echo ────────────────────────────────────────────────────────────
echo.
echo How to verify:
echo ────────────────────────────────────────────────────────────
echo   1. Open Task Scheduler:
echo      Press Win+R, type: taskschd.msc
echo      Find: "LabMonitor Agent"
echo      Status should be: "Running"
echo.
echo   2. Check agent process:
echo      Open Command Prompt, type: tasklist ^| findstr node
echo      Should see: node.exe
echo.
echo   3. Check agent log:
echo      Open: %AGENT_PATH%\logs\agent.log
echo      Should see: "Agent started successfully"
echo ────────────────────────────────────────────────────────────
echo.
echo To uninstall:
echo ────────────────────────────────────────────────────────────
echo   Run: %AGENT_PATH%\uninstall-autostart.bat
echo   (Right-click → Run as administrator)
echo ────────────────────────────────────────────────────────────
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Press any key to exit...
pause >nul
