@echo off
REM ========================================
REM LabMonitor Agent Installer
REM ========================================

echo.
echo ========================================
echo   LabMonitor Agent Installer
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run this installer as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo [INFO] Running as Administrator...
echo.

REM Check Node.js
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Downloading Node.js installer...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile '%TEMP%\nodejs.msi'"
    echo Installing Node.js...
    msiexec /i "%TEMP%\nodejs.msi" /quiet /norestart
    echo [INFO] Node.js installed. Please restart this installer.
    pause
    exit /b 0
)

echo [OK] Node.js found
node --version
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if %errorLevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Create logs directory
if not exist "logs" mkdir logs
echo [OK] Logs directory created
echo.

REM Configure agent
echo.
echo ========================================
echo   Agent Configuration
echo ========================================
echo.

REM Get computer ID
set /p COMPUTER_ID="Enter Computer ID (e.g., PC-01): "
if "%COMPUTER_ID%"=="" (
    echo [ERROR] Computer ID is required!
    pause
    exit /b 1
)

REM Get student ID
set /p STUDENT_ID="Enter Student ID (e.g., 1): "

REM Get backend URL
set /p BACKEND_URL="Enter Backend URL (e.g., http://192.168.100.166:3001): "
if "%BACKEND_URL%"=="" (
    echo [ERROR] Backend URL is required!
    pause
    exit /b 1
)

REM Update .env file
echo # LabMonitor Agent Configuration > .env
echo BACKEND_URL=%BACKEND_URL% >> .env
echo COMPUTER_ID=%COMPUTER_ID% >> .env
echo STUDENT_ID=%STUDENT_ID% >> .env
echo SYSTEM_MONITOR_INTERVAL=5000 >> .env
echo BROWSER_MONITOR_INTERVAL=10000 >> .env
echo LOG_LEVEL=info >> .env
echo LOG_FILE=agent.log >> .env
echo RECONNECT_DELAY=5000 >> .env
echo MAX_RECONNECT_ATTEMPTS=10 >> .env

echo [OK] Configuration saved
echo.

REM Install as Windows Service
echo.
echo ========================================
echo   Install as Windows Service
echo ========================================
echo.

set /p INSTALL_SERVICE="Install as Windows Service? (Y/N): "
if /i "%INSTALL_SERVICE%"=="Y" (
    echo [INFO] Installing Windows Service...
    call npm run install-service
    if %errorLevel% neq 0 (
        echo [WARNING] Failed to install as service
        echo You can run the agent manually with: npm start
    ) else (
        echo [OK] Service installed successfully
        echo [INFO] Agent will start automatically on boot
    )
) else (
    echo [INFO] Skipping service installation
    echo [INFO] You can start the agent manually with: npm start
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Computer ID: %COMPUTER_ID%
echo Backend URL: %BACKEND_URL%
echo.
echo To start agent manually: npm start
echo To check logs: type logs\agent.log
echo.
pause
