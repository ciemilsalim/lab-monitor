@echo off
REM ========================================
REM LabMonitor Agent - Switch to VISIBLE Mode
REM Mengubah agent dari silent ke visible (with CMD window)
REM ========================================

color 0B
title LabMonitor Agent - Switch to Visible Mode

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     LabMonitor Agent - Switch to VISIBLE Mode             ║
echo ║     Agent akan berjalan DENGAN window CMD                 ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Script ini harus dijalankan sebagai Administrator!
    pause
    exit /b 1
)

echo [OK] Running as Administrator
echo.

REM Get paths
set AGENT_PATH=%~dp0
set AGENT_PATH=%AGENT_PATH:~0,-1%
set AGENT_SCRIPT=%AGENT_PATH%\src\agent.js

REM Get Node.js path
for /f "tokens=*" %%i in ('where node') do set NODE_PATH=%%i

echo [INFO] Node path: %NODE_PATH%
echo [INFO] Agent script: %AGENT_SCRIPT%
echo.

REM Stop current agent
echo [STEP 1] Stopping current agent...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Agent stopped
echo.

REM Delete old task
echo [STEP 2] Removing old task...
schtasks /delete /tn "LabMonitor Agent" /f >nul 2>&1
echo [OK] Old task removed
echo.

REM Create new task with direct node execution (visible mode)
echo [STEP 3] Creating new task (VISIBLE MODE)...

schtasks /create ^
    /tn "LabMonitor Agent" ^
    /tr "\"%NODE_PATH%\" \"%AGENT_SCRIPT%\"" ^
    /sc onstart ^
    /ru SYSTEM ^
    /rl highest ^
    /delay 0000:30 ^
    /f

if %errorLevel% neq 0 (
    color 0C
    echo [ERROR] Failed to create task!
    pause
    exit /b 1
)

echo [OK] Task created successfully
echo.

REM Configure task
echo [STEP 4] Configuring task...
schtasks /change /tn "LabMonitor Agent" /ru SYSTEM >nul 2>&1
schtasks /change /tn "LabMonitor Agent" /ri 1 /k >nul 2>&1
echo [OK] Task configured
echo.

REM Start agent
echo [STEP 5] Starting agent in VISIBLE mode...
schtasks /run /tn "LabMonitor Agent" >nul 2>&1
timeout /t 3 /nobreak >nul

REM Verify
tasklist | findstr "node.exe" >nul 2>&1
if %errorLevel% neq 0 (
    color 0E
    echo [WARNING] Agent may need a few seconds to start
) else (
    echo [OK] Agent is running
)
echo.

REM Summary
color 0A
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           SWITCH TO VISIBLE MODE COMPLETE!                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Mode: VISIBLE (With CMD window)
echo.
echo What changed:
echo ────────────────────────────────────────────────────────────
echo   ✓ Agent now runs WITH visible CMD window
echo   ✓ You can see agent progress and logs
echo   ✓ Useful for debugging and monitoring
echo   ✓ Auto-start still works on computer boot
echo ────────────────────────────────────────────────────────────
echo.
echo How to verify:
echo ────────────────────────────────────────────────────────────
echo   1. Check process: tasklist ^| findstr node
echo      (node.exe running WITH cmd.exe window visible)
echo.
echo   2. Check Task Scheduler:
echo      schtasks /query /tn "LabMonitor Agent"
echo      (Command should be: node.exe "src\agent.js")
echo.
echo   3. Check agent log:
echo      type %AGENT_PATH%\logs\agent.log
echo ────────────────────────────────────────────────────────────
echo.
echo To switch back to SILENT mode:
echo ────────────────────────────────────────────────────────────
echo   Run: switch-to-silent.bat
echo ────────────────────────────────────────────────────────────
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
