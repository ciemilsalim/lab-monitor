@echo off
REM ========================================
REM LabMonitor Agent - Start Silent Mode
REM File: start-silent.bat
REM 
REM Agent akan berjalan di background tanpa window CMD
REM ========================================

REM Get script directory
set AGENT_DIR=%~dp0

REM Start agent hidden using VBScript
start "" wscript.exe "%AGENT_DIR%run-agent-silent.vbs"

echo.
echo ========================================
echo   Agent started in SILENT mode
echo ========================================
echo.
echo   Agent berjalan di background.
echo   Window CMD ini bisa ditutup.
echo.
echo   Untuk stop agent:
echo     taskkill /F /IM node.exe
echo.
echo   Untuk cek agent running:
echo     tasklist ^| findstr node
echo.
echo   Untuk lihat log:
echo     type %AGENT_DIR%logs\agent.log
echo.
echo ========================================
echo.

REM Auto close this window after 3 seconds
timeout /t 3 /nobreak >nul
exit
