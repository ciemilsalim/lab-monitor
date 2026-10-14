@echo off
REM ========================================
REM LabMonitor Agent - Stop Silent
REM File: stop-agent.bat
REM ========================================

echo.
echo ========================================
echo   Stopping LabMonitor Agent...
echo ========================================
echo.

REM Check if agent is running
tasklist | findstr "node.exe" >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Agent tidak sedang berjalan.
    echo.
    pause
    exit /b 0
)

REM Kill node process
taskkill /F /IM node.exe >nul 2>&1

if %errorLevel% equ 0 (
    echo [OK] Agent berhasil di-stop.
) else (
    echo [ERROR] Gagal stop agent. Coba jalankan sebagai Administrator.
)

echo.
pause
