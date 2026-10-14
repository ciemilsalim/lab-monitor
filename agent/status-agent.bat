@echo off
REM ========================================
REM LabMonitor Agent - Status Check
REM File: status-agent.bat
REM ========================================

echo.
echo ========================================
echo   LabMonitor Agent Status
echo ========================================
echo.

REM Check if agent is running
tasklist | findstr "node.exe" >nul 2>&1
if %errorLevel% equ 0 (
    echo [OK] Agent sedang berjalan
    echo.
    echo Process details:
    tasklist | findstr "node.exe"
    echo.
    
    REM Check if log file exists
    if exist "logs\agent.log" (
        echo [INFO] Last 5 lines from log:
        echo ----------------------------------------
        powershell -Command "Get-Content 'logs\agent.log' -Tail 5"
        echo ----------------------------------------
    ) else (
        echo [INFO] Log file belum ada
    )
) else (
    echo [INFO] Agent tidak sedang berjalan
    echo.
    echo Untuk start agent:
    echo   start-silent.bat
)

echo.
echo ========================================
echo.
pause
