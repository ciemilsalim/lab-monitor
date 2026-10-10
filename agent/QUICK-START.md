# 🚀 QUICK START: Auto-Start & Internet Blocking

## 📋 2 Masalah yang Diselesaikan

### **Masalah 1: Agent Tidak Auto-Start**
❌ Agent harus dijalankan manual setiap kali komputer boot  
✅ **SOLUSI:** Agent otomatis berjalan saat komputer dinyalakan

### **Masalah 2: Agent Tidak Bisa Connect Setelah Internet Diblokir**
❌ Internet diblokir → Agent disconnect → Tidak bisa unblock  
✅ **SOLUSI:** Internet diblokir → Agent tetap connect → Bisa unblock

---

## ✅ SOLUSI 1: Setup Auto-Start Agent

### **Cara Setup (3 Menit):**

```cmd
# Di PC siswa (sebagai Administrator)
cd C:\labmonitor-agent

# Jalankan setup
setup-autostart.bat
```

**Pilih:**
- ✅ Windows Service: **Y** (Primary)
- ✅ Task Scheduler: **Y** (Backup)
- ✅ Startup Folder: **Y** (Backup)

### **Verifikasi:**

```cmd
# Cek Windows Service
services.msc
# Cari: "LabMonitor Agent"
# Status: "Running"
# Startup Type: "Automatic"
```

### **Cara Uninstall:**

```cmd
cd C:\labmonitor-agent
uninstall-autostart.bat
```

---

## ✅ SOLUSI 2: Internet Blocking dengan Whitelist

### **Cara Kerja:**

```
┌─────────────────────────────────────────────────────────┐
│  Block Internet (dengan Whitelist Server)              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ ALLOW: Server Backend (192.168.100.166)            │
│     → Agent tetap bisa connect ke server              │
│     → Bisa terima command "unblock"                   │
│                                                         │
│  ✅ ALLOW: LAN Traffic (192.168.x.x)                  │
│     → Bisa akses printer, file server                 │
│                                                         │
│  ❌ BLOCK: Internet (semua website)                    │
│     → Siswa tidak bisa akses internet                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Cara Block Internet:**

1. Buka dashboard admin: **http://localhost:3000**
2. Klik komputer siswa
3. Tab **"Kontrol"**
4. Klik **"Blokir Internet"**

**Hasil:**
- ✅ Internet terblokir untuk siswa
- ✅ Agent tetap connect ke server
- ✅ Bisa unblock dari dashboard

### **Cara Unblock Internet:**

**Option 1: Dari Dashboard (RECOMMENDED)**
1. Di dashboard admin
2. Klik **"Buka Internet"**

**Option 2: Manual (Emergency)**
```cmd
# Di PC siswa (sebagai Administrator)
cd C:\labmonitor-agent
manual-unblock-internet.bat
```

---

## 🆘 Emergency Recovery

### **Jika Agent Tidak Bisa Connect Setelah Block:**

```cmd
# Di PC siswa (sebagai Administrator)
cd C:\labmonitor-agent

# Jalankan manual unblock
manual-unblock-internet.bat
```

**Script ini akan:**
1. ✅ Hapus semua firewall rules
2. ✅ Test koneksi internet
3. ✅ Test koneksi ke server
4. ✅ Agent auto-reconnect

---

## 📊 Testing

### **Test 1: Auto-Start**

```cmd
# Restart komputer PC siswa
shutdown /r /t 0

# Setelah boot, cek agent:
tasklist | findstr node

# Expected: node.exe running
```

### **Test 2: Block Internet**

```cmd
# Di PC siswa
ping google.com
# Expected: Request timed out

ping 192.168.100.166
# Expected: Reply from 192.168.100.166
```

### **Test 3: Unblock Internet**

```cmd
# Setelah unblock dari dashboard
ping google.com
# Expected: Reply from google.com
```

---

## 🔧 Troubleshooting

### **Problem: Agent Tidak Auto-Start**

**Solusi:**
```cmd
cd C:\labmonitor-agent
setup-autostart.bat
# Pilih "Y" untuk semua options
```

### **Problem: Agent Disconnect Setelah Block**

**Solusi:**
```cmd
cd C:\labmonitor-agent
manual-unblock-internet.bat
```

### **Problem: Siswa Masih Bisa Akses Internet**

**Cek:**
```cmd
# Lihat firewall rules
netsh advfirewall firewall show rule name=all | findstr LabMonitor

# Harus ada:
# - LabMonitor_Block_ALL_Out (Action: Block)
# - LabMonitor_Block_HTTP (Action: Block)
# - LabMonitor_Block_DNS (Action: Block)
```

---

## 📁 Files yang Dibuat

| File | Fungsi |
|------|--------|
| `setup-autostart.bat` | Setup auto-start agent |
| `uninstall-autostart.bat` | Uninstall auto-start |
| `manual-unblock-internet.bat` | Manual unblock internet |
| `src/controllers/remote.js` | Updated dengan whitelist |
| `PANDUAN-AUTOSTART-BLOCK.md` | Dokumentasi lengkap |

---

## 🎯 Quick Commands

### **Setup Auto-Start:**
```cmd
cd C:\labmonitor-agent
setup-autostart.bat
```

### **Manual Unblock:**
```cmd
cd C:\labmonitor-agent
manual-unblock-internet.bat
```

### **Cek Status Agent:**
```cmd
tasklist | findstr node
```

### **Cek Firewall Rules:**
```cmd
netsh advfirewall firewall show rule name=all | findstr LabMonitor
```

---

## ✅ Summary

### **Yang Sudah Diperbaiki:**

1. ✅ **Agent Auto-Start** - Setup via `setup-autostart.bat`
2. ✅ **Internet Blocking** - Block internet tapi agent tetap connect
3. ✅ **Emergency Recovery** - Manual unblock via `manual-unblock-internet.bat`

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

### **Status:** ✅ **READY TO USE** 🎉

---

## 📞 Dokumentasi Lengkap

Baca file: `agent/PANDUAN-AUTOSTART-BLOCK.md` untuk detail lengkap.
