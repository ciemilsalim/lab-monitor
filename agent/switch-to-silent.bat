@echo off
REM ========================================
REM LabMonitor Agent - Switch to SILENT Mode
REM Mengubah agent dari visible ke silent (no CMD window)
REM ========================================

color 0E
title LabMonitor Agent - Switch to Silent Mode

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     LabMonitor Agent - Switch to SILENT Mode              ║
echo ║     Agent akan berjalan TANPA window CMD                  ║
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
set VBS_RUNNER=%AGENT_PATH%\run-agent.vbs

REM Check VBS runner
if not exist "%VBS_RUNNER%" (
    color 0C
    echo [ERROR] File run-agent.vbs tidak ditemukan!
    echo.
    echo Pastikan file run-agent.vbs ada di: %AGENT_PATH%
    pause
    exit /b 1
)

echo [OK] VBS runner found: %VBS_RUNNER%
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

REM Create new task with VBScript wrapper (silent mode)
echo [STEP 3] Creating new task (SILENT MODE)...

schtasks /create ^
    /tn "LabMonitor Agent" ^
    /tr "wscript.exe \"%VBS_RUNNER%\"" ^
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
echo [STEP 5] Starting agent in SILENT mode...
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
echo ║           SWITCH TO SILENT MODE COMPLETE!                 ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Mode: SILENT (No CMD window)
echo.
echo What changed:
echo ────────────────────────────────────────────────────────────
echo   ✓ Agent now runs WITHOUT visible CMD window
echo   ✓ Students cannot see or close the agent
echo   ✓ Agent continues monitoring in background
echo   ✓ Auto-start still works on computer boot
echo ────────────────────────────────────────────────────────────
echo.
echo How to verify:
echo ────────────────────────────────────────────────────────────
echo   1. Check process: tasklist ^| findstr node
echo      (node.exe running, but NO cmd.exe window visible)
echo.
echo   2. Check Task Scheduler:
echo      schtasks /query /tn "LabMonitor Agent"
echo      (Command should be: wscript.exe "run-agent.vbs")
echo.
echo   3. Check agent log:
echo      type %AGENT_PATH%\logs\agent.log
echo ────────────────────────────────────────────────────────────
echo.
echo To switch back to VISIBLE mode:
echo ────────────────────────────────────────────────────────────
echo   Run: switch-to-visible.bat
echo ────────────────────────────────────────────────────────────
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
