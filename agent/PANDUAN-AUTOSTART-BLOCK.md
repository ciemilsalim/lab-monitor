# 🚀 Panduan Lengkap: Auto-Start Agent & Internet Blocking

## 📋 Daftar Isi

1. [Masalah yang Diselesaikan](#masalah-yang-diselesaikan)
2. [Solusi 1: Agent Auto-Start](#solusi-1-agent-auto-start)
3. [Solusi 2: Internet Blocking dengan Whitelist](#solusi-2-internet-blocking-dengan-whitelist)
4. [Cara Menggunakan](#cara-menggunakan)
5. [Troubleshooting](#troubleshooting)

---

## 🔍 Masalah yang Diselesaikan

### **Masalah 1: Agent Tidak Auto-Start**
❌ **Sebelum:** Agent harus dijalankan manual setiap kali komputer boot  
✅ **Sesudah:** Agent otomatis berjalan saat komputer dinyalakan

### **Masalah 2: Agent Tidak Bisa Connect Setelah Internet Diblokir**
❌ **Sebelum:** Internet diblokir → Agent tidak bisa connect → Tidak bisa unblock  
✅ **Sesudah:** Internet diblokir → Agent tetap connect ke server → Bisa unblock

---

## ✅ Solusi 1: Agent Auto-Start

### **3 Metode Auto-Start (Pilih Salah Satu atau Semua)**

#### **Method 1: Windows Service (RECOMMENDED)**
✅ **Keuntungan:**
- Berjalan sebagai service Windows
- Auto-start saat boot (sebelum user login)
- Paling reliable
- Bisa di-monitor via services.msc

✅ **Cara Install:**
```cmd
cd C:\labmonitor-agent
setup-autostart.bat
# Pilih "Y" untuk Windows Service
```

✅ **Cara Cek Status:**
```cmd
# Buka services.msc
# Cari: "LabMonitor Agent"
# Status harus: "Running"
# Startup Type: "Automatic"
```

✅ **Cara Uninstall:**
```cmd
cd C:\labmonitor-agent
uninstall-autostart.bat
```

---

#### **Method 2: Task Scheduler (BACKUP)**
✅ **Keuntungan:**
- Berjalan saat boot
- Bisa di-monitor via Task Scheduler
- Backup jika service gagal

✅ **Cara Install:**
```cmd
cd C:\labmonitor-agent
setup-autostart.bat
# Pilih "Y" untuk Task Scheduler
```

✅ **Cara Cek Status:**
```cmd
# Buka Task Scheduler
# Cari: "LabMonitor Agent"
# Status harus: "Ready"
# Trigger: "At startup"
```

---

#### **Method 3: Startup Folder (BACKUP)**
✅ **Keuntungan:**
- Berjalan saat user login
- Paling simple
- Tidak perlu admin rights

✅ **Cara Install:**
```cmd
cd C:\labmonitor-agent
setup-autostart.bat
# Pilih "Y" untuk Startup Folder
```

✅ **Cara Cek:**
```cmd
# Buka folder:
%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
# Harus ada file: LabMonitorAgent.vbs
```

---

### **🎯 Rekomendasi Setup**

**Untuk Production (Lab Komputer):**
```
✅ Windows Service (Primary)
✅ Task Scheduler (Backup)
✅ Startup Folder (Backup)
```

**Untuk Testing:**
```
✅ Windows Service saja
```

---

## ✅ Solusi 2: Internet Blocking dengan Whitelist

### **Cara Kerja:**

```
┌─────────────────────────────────────────────────────────┐
│  Agent Block Internet (dengan Whitelist)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. ALLOW: Traffic ke Server Backend                   │
│     → Agent tetap bisa connect ke server              │
│     → Bisa terima command "unblock"                   │
│                                                         │
│  2. ALLOW: LAN Traffic (192.168.x.x, 10.x.x.x)        │
│     → Bisa akses printer, file server, dll            │
│     → Bisa connect ke komputer lain di LAN            │
│                                                         │
│  3. BLOCK: Semua traffic lainnya (Internet)            │
│     → Siswa tidak bisa akses internet                 │
│     → Tidak bisa buka website, YouTube, dll           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Firewall Rules yang Dibuat:**

```cmd
✅ Rule 1: Allow traffic to backend server (192.168.100.166)
✅ Rule 2: Allow LAN traffic (192.168.0.0/16)
✅ Rule 3: Allow LAN traffic (10.0.0.0/8)
✅ Rule 4: Allow LAN traffic (172.16.0.0/12)
✅ Rule 5: Block ALL outbound traffic
✅ Rule 6: Block HTTP/HTTPS (80, 443)
✅ Rule 7: Block DNS UDP (53)
✅ Rule 8: Block DNS TCP (53)
```

### **Hasil:**

| Akses | Status | Keterangan |
|-------|--------|------------|
| **Server Backend** | ✅ ALLOW | Agent bisa connect |
| **LAN (192.168.x.x)** | ✅ ALLOW | Bisa akses printer, file server |
| **Internet** | ❌ BLOCK | Tidak bisa akses website |
| **DNS** | ❌ BLOCK | Tidak bisa resolve domain |

---

## 🚀 Cara Menggunakan

### **Step 1: Setup Auto-Start Agent**

```cmd
# Di PC siswa (sebagai Administrator)
cd C:\labmonitor-agent

# Jalankan setup
setup-autostart.bat

# Pilih:
# - Windows Service: Y
# - Task Scheduler: Y
# - Startup Folder: Y
```

### **Step 2: Copy File Agent yang Sudah Diupdate**

```powershell
# Di server admin
copy agent\src\controllers\remote.js \\PC-13\C$\labmonitor-agent\src\controllers\
```

### **Step 3: Restart Agent**

```cmd
# Di PC siswa
cd C:\labmonitor-agent
npm start
```

### **Step 4: Test Block Internet**

1. Buka dashboard admin
2. Klik komputer siswa
3. Tab "Kontrol"
4. Klik "Blokir Internet"

**Expected:**
- ✅ Internet terblokir untuk siswa
- ✅ Agent tetap connect ke server
- ✅ Bisa unblock dari dashboard

### **Step 5: Test Unblock Internet**

1. Di dashboard admin
2. Klik "Buka Internet"

**Expected:**
- ✅ Internet kembali normal
- ✅ Siswa bisa akses internet lagi

---

## 🆘 Emergency Recovery

### **Jika Agent Tidak Bisa Connect Setelah Block Internet:**

**Gunakan Manual Unblock Script:**

```cmd
# Di PC siswa (sebagai Administrator)
cd C:\labmonitor-agent

# Jalankan manual unblock
manual-unblock-internet.bat
```

**Script ini akan:**
1. Hapus semua firewall rules LabMonitor
2. Test koneksi internet
3. Test koneksi ke server
4. Agent akan auto-reconnect

---

## 🔧 Troubleshooting

### **Problem 1: Agent Tidak Auto-Start**

**Gejala:**
- Komputer boot tapi agent tidak jalan
- Harus run manual setiap kali

**Solusi:**

**Cek 1: Windows Service**
```cmd
# Buka services.msc
# Cari: "LabMonitor Agent"
# Jika tidak ada, install ulang:
cd C:\labmonitor-agent
setup-autostart.bat
```

**Cek 2: Task Scheduler**
```cmd
# Buka Task Scheduler
# Cari: "LabMonitor Agent"
# Jika tidak ada, install ulang
```

**Cek 3: Startup Folder**
```cmd
# Buka folder:
%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
# Harus ada: LabMonitorAgent.vbs
```

---

### **Problem 2: Agent Tidak Bisa Connect Setelah Block**

**Gejala:**
- Internet diblokir
- Agent disconnect dari server
- Tidak bisa unblock dari dashboard

**Solusi:**

**Option 1: Manual Unblock**
```cmd
# Di PC siswa
cd C:\labmonitor-agent
manual-unblock-internet.bat
```

**Option 2: Restart Agent**
```cmd
# Stop agent (Ctrl+C)
# Start lagi
npm start
```

**Option 3: Restart Komputer**
```cmd
shutdown /r /t 0
```

---

### **Problem 3: Siswa Masih Bisa Akses Internet**

**Gejala:**
- Internet sudah diblokir
- Tapi siswa masih bisa buka website

**Solusi:**

**Cek 1: Firewall Rules**
```cmd
# Lihat semua rules LabMonitor
netsh advfirewall firewall show rule name=all | findstr LabMonitor

# Harus ada:
# - LabMonitor_Block_ALL_Out (Action: Block)
# - LabMonitor_Block_HTTP (Action: Block)
# - LabMonitor_Block_DNS (Action: Block)
```

**Cek 2: Test Ping**
```cmd
ping google.com
# Expected: Request timed out

ping 192.168.100.166
# Expected: Reply from 192.168.100.166
```

**Cek 3: Browser**
```
Buka Chrome/Firefox
Coba akses: https://google.com
Expected: ERR_CONNECTION_TIMED_OUT
```

---

### **Problem 4: Agent Connect Tapi Tidak Bisa Block**

**Gejala:**
- Agent connect ke server
- Tapi command "block" tidak berfungsi

**Solusi:**

**Cek 1: Agent Running sebagai Administrator**
```cmd
# Cek di Task Manager
# Agent harus running sebagai Administrator

# Jika tidak, restart sebagai admin:
cd C:\labmonitor-agent
# Right-click Command Prompt → Run as Administrator
npm start
```

**Cek 2: Firewall Service**
```cmd
# Cek Windows Firewall service
sc query MpsSvc

# Jika stopped, start:
net start MpsSvc
```

**Cek 3: Agent Log**
```cmd
type C:\labmonitor-agent\logs\agent.log

# Cari:
# 🚫 Executing BLOCK INTERNET command
# ✅ Rule X applied successfully
```

---

## 📊 Monitoring & Maintenance

### **Cek Status Agent:**

```cmd
# Via Windows Service
services.msc → LabMonitor Agent

# Via Task Scheduler
taskschd.msc → LabMonitor Agent

# Via Command Line
tasklist | findstr node
```

### **Cek Firewall Rules:**

```cmd
# Lihat semua rules LabMonitor
netsh advfirewall firewall show rule name=all | findstr LabMonitor

# Lihat rules yang aktif
netsh advfirewall firewall show rule name=all dir=out
```

### **Cek Koneksi:**

```cmd
# Test ke server
ping 192.168.100.166
telnet 192.168.100.166 3001

# Test internet (harus gagal jika diblokir)
ping google.com
```

### **Cek Log:**

```cmd
# Agent log
type C:\labmonitor-agent\logs\agent.log

# Backend log (di server)
type D:\labmonitor-backend\logs\server.log
```

---

## 🎯 Best Practices

### **Untuk Production:**

1. ✅ **Gunakan Windows Service** sebagai primary
2. ✅ **Setup Task Scheduler** sebagai backup
3. ✅ **Monitor log** secara berkala
4. ✅ **Test block/unblock** setiap minggu
5. ✅ **Backup konfigurasi** agent

### **Untuk Security:**

1. ✅ **Jangan share password** admin
2. ✅ **Ganti JWT secret** di `.env`
3. ✅ **Monitor agent log** untuk suspicious activity
4. ✅ **Update agent** secara berkala
5. ✅ **Backup database** setiap hari

### **Untuk Performance:**

1. ✅ **Set monitoring interval** yang sesuai (5-10 detik)
2. ✅ **Monitor CPU/RAM** usage agent
3. ✅ **Cleanup log** secara berkala
4. ✅ **Optimize screenshot** quality
5. ✅ **Monitor network** bandwidth

---

## 📞 Support

### **Dokumentasi:**
- `agent/README.md` - Panduan instalasi agent
- `agent/TROUBLESHOOTING-REMOTE.md` - Troubleshooting remote control
- `agent/TROUBLESHOOTING-BLOCK-INTERNET.md` - Troubleshooting block internet

### **Scripts:**
- `agent/setup-autostart.bat` - Setup auto-start
- `agent/uninstall-autostart.bat` - Uninstall auto-start
- `agent/manual-unblock-internet.bat` - Manual unblock internet

### **Files:**
- `agent/src/controllers/remote.js` - Remote control & block internet
- `agent/src/agent.js` - Main agent file
- `agent/.env` - Konfigurasi agent

---

## ✅ Summary

### **Masalah yang Diselesaikan:**

1. ✅ **Agent Auto-Start** - Agent otomatis berjalan saat boot
2. ✅ **Internet Blocking** - Block internet tapi agent tetap connect
3. ✅ **Emergency Recovery** - Manual unblock jika agent disconnect

### **Files yang Dibuat:**

1. ✅ `agent/setup-autostart.bat` - Setup auto-start
2. ✅ `agent/uninstall-autostart.bat` - Uninstall auto-start
3. ✅ `agent/manual-unblock-internet.bat` - Manual unblock
4. ✅ `agent/src/controllers/remote.js` - Updated dengan whitelist

### **Cara Menggunakan:**

1. **Setup Auto-Start:**
   ```cmd
   cd C:\labmonitor-agent
   setup-autostart.bat
   ```

2. **Block Internet:**
   - Dari dashboard admin
   - Agent tetap connect ke server

3. **Unblock Internet:**
   - Dari dashboard admin
   - Atau manual: `manual-unblock-internet.bat`

### **Status:** ✅ **READY FOR PRODUCTION** 🎉
