# LabMonitor Agent

Agent monitoring untuk PC siswa yang berjalan di background dan mengirim data ke server LabMonitor.

## 🚀 Fitur

### System Monitoring
- ✅ CPU usage (real-time)
- ✅ RAM usage (real-time)
- ✅ Network speed (upload/download)
- ✅ Active application detection
- ✅ Current URL tracking

### Browser Monitoring
- ✅ Detect semua tab browser (Chrome, Firefox, Edge)
- ✅ Track judul halaman & URL
- ✅ Auto-categorize (educational/social/entertainment)
- ✅ Calculate duration per tab

### Remote Control
- ✅ Shutdown / Restart
- ✅ Lock screen
- ✅ Block/Unblock internet
- ✅ Show message to student
- ✅ Take screenshot
- ✅ Open URL
- ✅ Close application

### Auto-start
- ✅ Register sebagai Windows Service
- ✅ Start otomatis saat boot
- ✅ Auto-reconnect jika koneksi putus
- ✅ Run di background (no UI)

## 📦 Instalasi

### Cara 1: Installer Otomatis (Recommended)

1. Copy folder `agent` ke PC siswa
2. Right-click `install.bat` → **Run as Administrator**
3. Ikuti instruksi:
   - Masukkan Computer ID (misal: PC-01)
   - Masukkan Student ID (misal: 1)
   - Masukkan Backend URL (misal: http://192.168.100.166:3001)
   - Pilih install sebagai Windows Service (Y)
4. Selesai! Agent akan otomatis berjalan

### Cara 2: Manual Installation

```bash
# 1. Install Node.js dari https://nodejs.org/

# 2. Clone/copy agent folder
cd C:\labmonitor-agent

# 3. Install dependencies
npm install

# 4. Configure .env
# Edit file .env dan sesuaikan:
BACKEND_URL=http://192.168.100.166:3001
COMPUTER_ID=PC-01
STUDENT_ID=1

# 5. Run agent
npm start

# 6. (Optional) Install as Windows Service
npm run install-service
```

## ⚙️ Konfigurasi

Edit file `.env`:

```env
# Backend Server URL
BACKEND_URL=http://192.168.100.166:3001

# Computer ID (harus sama dengan yang ada di database)
COMPUTER_ID=PC-01

# Student ID (opsional)
STUDENT_ID=1

# Monitoring intervals (dalam milidetik)
SYSTEM_MONITOR_INTERVAL=5000
BROWSER_MONITOR_INTERVAL=10000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/agent.log

# Auto-reconnect
RECONNECT_DELAY=5000
MAX_RECONNECT_ATTEMPTS=10
```

## 🖥️ Windows Service Management

### Install Service
```bash
npm run install-service
```

### Uninstall Service
```bash
npm run uninstall-service
```

### Check Service Status
```powershell
# Buka Services (services.msc)
# Cari "LabMonitor Agent"
# Status harus "Running"
```

### Manual Start/Stop
```powershell
# Start
net start LabMonitorAgent

# Stop
net stop LabMonitorAgent
```

## 📊 Data yang Dikirim

### System Data (setiap 5 detik)
```json
{
  "computerId": "PC-01",
  "status": "online",
  "cpu": 45.5,
  "ram": 62.3,
  "networkSpeed": 85.2,
  "currentApp": "Chrome",
  "currentUrl": "https://github.com"
}
```

### Browser Data (setiap 10 detik)
```json
{
  "computerId": "PC-01",
  "studentId": 1,
  "tabs": [
    {
      "id": "chrome-123",
      "url": "https://github.com",
      "domain": "github.com",
      "title": "GitHub",
      "category": "educational",
      "isActive": true,
      "browser": "chrome",
      "duration": 320
    }
  ],
  "activeUrl": "https://github.com",
  "activeTitle": "GitHub"
}
```

## 🔧 Troubleshooting

### Agent tidak connect ke backend
1. Cek `BACKEND_URL` di `.env` sudah benar
2. Cek backend server berjalan: `http://192.168.100.166:3001/health`
3. Cek firewall tidak memblokir port 3001
4. Cek log: `type logs\agent.log`

### Browser tabs tidak terdeteksi
1. Chrome harus dijalankan dengan flag: `--remote-debugging-port=9222`
2. Atau gunakan metode window title (less accurate)
3. Cek log untuk detail error

### Service tidak start otomatis
1. Buka `services.msc`
2. Cari "LabMonitor Agent"
3. Pastikan Startup Type = "Automatic"
4. Restart service

### High CPU/RAM usage
1. Check interval di `.env` (default 5 detik)
2. Naikkan interval jika perlu (misal 10000 = 10 detik)
3. Restart agent setelah perubahan

## 📝 Logs

Log disimpan di folder `logs/`:
- `agent.log` - Semua log
- `error.log` - Error log only

View logs:
```powershell
type logs\agent.log
```

## 🔒 Security Notes

- Agent berjalan dengan privilege user yang login
- Untuk remote commands (shutdown, lock), agent butuh admin privilege
- Install sebagai Windows Service untuk full functionality
- Firewall harus mengizinkan koneksi ke backend

## 🛠️ Development

### Run in development mode
```bash
npm run dev
```

### Build executable
```bash
npm install -g pkg
pkg package.json --targets node18-win-x64 --output dist/labmonitor-agent.exe
```

## 📞 Support

Untuk bantuan:
- Email: support@labmonitor.local
- Documentation: docs.labmonitor.local

## 📄 License

MIT License - LabMonitor Team
