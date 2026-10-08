@echo off
REM ========================================
REM LabMonitor - Manual Unblock Internet
REM Gunakan ini jika agent tidak bisa connect
REM ========================================

echo.
echo ========================================
echo   LabMonitor - Manual Unblock Internet
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

echo [INFO] Menghapus semua firewall rules LabMonitor...
echo.

REM Remove all LabMonitor firewall rules
netsh advfirewall firewall delete rule name="LabMonitor_Block_ALL_Out" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Block_HTTP" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Block_DNS" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Block_DNS_TCP" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Block_TCP" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Allow_Server" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Allow_LAN_192" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Allow_LAN_10" >nul 2>&1
netsh advfirewall firewall delete rule name="LabMonitor_Allow_LAN_172" >nul 2>&1

echo [OK] Semua firewall rules LabMonitor dihapus
echo.

echo [INFO] Testing koneksi internet...
ping -n 2 google.com >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Internet masih belum bisa diakses
    echo [INFO] Mungkin ada masalah dengan DNS atau network
    echo.
    echo [INFO] Coba restart network adapter:
    echo   1. Buka Network Connections
    echo   2. Disable adapter, lalu Enable lagi
    echo   3. Atau restart komputer
) else (
    echo [OK] Internet berhasil dipulihkan!
    echo.
    echo [INFO] Testing koneksi ke server LabMonitor...
    ping -n 2 192.168.100.166 >nul 2>&1
    if %errorLevel% neq 0 (
        echo [WARNING] Server LabMonitor tidak bisa diakses
        echo [INFO] Pastikan server berjalan di 192.168.100.166:3001
    ) else (
        echo [OK] Server LabMonitor bisa diakses
    )
)

echo.
echo ========================================
echo   Internet Unblocked!
echo ========================================
echo.
echo Sekarang agent bisa connect ke server lagi.
echo Agent akan otomatis reconnect dalam 5-10 detik.
echo.
pause
