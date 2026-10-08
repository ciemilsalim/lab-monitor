# 🔧 Troubleshooting: Command Diblokir oleh Windows

## 📋 Masalah

**Gejala:**
- ✅ Command sampai ke agent
- ❌ Agent tidak bisa execute command
- ❌ Muncul error di CMD: "Access is denied" atau "The requested operation requires elevation"

**Penyebab:**
- Agent tidak running sebagai **Administrator**
- Windows UAC (User Account Control) memblokir aksi tertentu
- Firewall rules butuh admin privilege
- Beberapa command butuh SYSTEM privilege

---

## ✅ SOLUSI: Run Agent sebagai Administrator

### **Option 1: Run Manual sebagai Administrator (Quick Fix)**

**Di PC-13:**

```cmd
# 1. Stop agent (Ctrl+C)

# 2. Buka Command Prompt sebagai Administrator
#    - Tekan Win + X
#    - Pilih "Command Prompt (Admin)" atau "Windows PowerShell (Admin)"

# 3. Jalankan agent
cd C:\labmonitor-agent
npm start
```

**Expected:**
- Agent berjalan dengan full admin privilege
- Semua command bisa di-execute
- Tidak ada error "Access is denied"

---

### **Option 2: Install sebagai Windows Service (RECOMMENDED)**

**Di PC-13:**

```cmd
# 1. Stop agent jika sedang jalan (Ctrl+C)

# 2. Install sebagai service
cd C:\labmonitor-agent
npm run install-service
```

**Expected output:**
```
Installing LabMonitor Agent service...
Service installed successfully
Service will start automatically on boot
```

**Verifikasi service:**

```cmd
# Cek status service
sc query LabMonitorAgent

# Expected:
# STATE: 4 RUNNING
```

**Atau buka Services:**
```cmd
# Tekan Win + R
# Ketik: services.msc
# Cari: "LabMonitor Agent"
# Status harus: "Running"
# Startup Type: "Automatic"
```

---

### **Option 3: Create Shortcut dengan Admin Privilege**

**Di PC-13:**

1. **Buat shortcut:**
   - Right-click Desktop → New → Shortcut
   - Location: `cmd.exe /k "cd C:\labmonitor-agent && npm start"`
   - Name: "LabMonitor Agent"

2. **Set shortcut untuk run as Admin:**
   - Right-click shortcut → Properties
   - Tab "Shortcut" → Click "Advanced"
   - Check "Run as administrator"
   - Click OK → OK

3. **Double-click shortcut** untuk start agent sebagai admin

---

## 🔍 Command yang Butuh Admin Privilege

| Command | Butuh Admin? | Keterangan |
|---------|--------------|------------|
| `shutdown` | ✅ **YES** | Matikan komputer |
| `restart` | ✅ **YES** | Restart komputer |
| `lock` | ✅ **YES** | Lock screen |
| `block_internet` | ✅ **YES** | Modifikasi firewall rules |
| `unblock_internet` | ✅ **YES** | Hapus firewall rules |
| `message` | ❌ NO | Show message box |
| `screenshot` | ❌ NO | Ambil screenshot |
| `open_url` | ❌ NO | Buka browser |
| `close_app` | ⚠️ **MAYBE** | Tergantung aplikasi |
| `view_screen` | ❌ NO | Lihat layar (screenshot) |

---

## 🧪 Testing Setelah Fix

### **Test 1: Block Internet**

**Langkah:**
1. Pastikan agent running sebagai Administrator
2. Di dashboard admin, klik PC-13 → Tab "Kontrol"
3. Klik "Remote Desktop Control"
4. Klik tombol "Block Internet" (atau kirim command via API)

**Expected di Terminal Agent:**
```
🚫 Attempting to block internet...
✅ Command 1 succeeded
✅ Command 2 succeeded
✅ Command 3 succeeded
✅ Command result: SUCCESS
✅ Message: Internet blocked successfully (3/3 rules applied)
```

**Expected di PC-13:**
- ✅ Internet terblokir
- ✅ Browser tidak bisa akses website
- ✅ Ping google.com gagal

**Verifikasi:**
```cmd
# Di PC-13, test koneksi
ping google.com

# Expected: Request timed out
```

---

### **Test 2: Unblock Internet**

**Langkah:**
1. Di dashboard admin, klik "Unblock Internet"

**Expected di Terminal Agent:**
```
✅ Attempting to unblock internet...
✅ Rule 1 removed
✅ Rule 2 removed
✅ Rule 3 removed
✅ Command result: SUCCESS
✅ Message: Internet unblocked successfully (3/3 rules removed)
```

**Expected di PC-13:**
- ✅ Internet kembali normal
- ✅ Browser bisa akses website

**Verifikasi:**
```cmd
# Di PC-13, test koneksi
ping google.com

# Expected: Reply from 142.250.xxx.xxx: bytes=32 time=10ms
```

---

### **Test 3: Lihat Layar (Screenshot)**

**Langkah:**
1. Di dashboard admin, klik "Lihat Layar" atau "Screenshot"

**Expected di Terminal Agent:**
```
📸 Executing SCREENSHOT command
✅ Command result: SUCCESS
✅ Message: Screenshot taken successfully
```

**Expected di PC-13:**
- ✅ Screenshot diambil
- ✅ File tersimpan di: `C:\Users\...\AppData\Local\Temp\labmonitor_screenshot_*.png`

**Verifikasi:**
```cmd
# Cek file screenshot
dir %TEMP%\labmonitor_screenshot_*.png
```

---

## 🚨 Troubleshooting Lanjutan

### **Problem: Masih error setelah run sebagai Admin**

**Gejala:**
- Agent running sebagai Administrator
- Tapi masih ada error "Access is denied"

**Solusi:**

1. **Cek Windows Firewall Service:**
```cmd
# Pastikan Windows Firewall service running
sc query MpsSvc

# Jika stopped, start:
net start MpsSvc
```

2. **Cek Group Policy:**
```cmd
# Cek apakah ada policy yang memblokir
gpresult /h C:\temp\gpreport.html

# Buka file HTML dan cek policy firewall
```

3. **Disable UAC sementara (NOT RECOMMENDED):**
```cmd
# Edit registry
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableLUA /t REG_DWORD /d 0 /f

# Restart komputer
shutdown /r /t 0
```

**⚠️ WARNING:** Disable UAC mengurangi security. Hanya untuk testing!

---

### **Problem: Service tidak start otomatis**

**Gejala:**
- Service terinstall
- Tapi tidak start saat boot

**Solusi:**

1. **Cek service configuration:**
```cmd
sc query LabMonitorAgent
sc qc LabMonitorAgent
```

2. **Set service ke Automatic:**
```cmd
sc config LabMonitorAgent start= auto
```

3. **Start service manual:**
```cmd
net start LabMonitorAgent
```

4. **Cek event log:**
```cmd
eventvwr.msc

# Buka: Windows Logs → Application
# Cari error terkait LabMonitorAgent
```

---

### **Problem: Firewall rules tidak di-create**

**Gejala:**
- Agent running sebagai Admin
- Tapi firewall rules tidak muncul

**Solusi:**

1. **Cek firewall rules manual:**
```cmd
netsh advfirewall firewall show rule name=all | findstr LabMonitor
```

2. **Create rules manual:**
```cmd
netsh advfirewall firewall add rule name="LabMonitor_Block_HTTP" dir=out action=block protocol=TCP remoteport=80,443
netsh advfirewall firewall add rule name="LabMonitor_Block_DNS" dir=out action=block protocol=UDP remoteport=53
netsh advfirewall firewall add rule name="LabMonitor_Block_TCP" dir=out action=block protocol=TCP
```

3. **Verify rules:**
```cmd
netsh advfirewall firewall show rule name="LabMonitor_Block_HTTP"
```

---

## 📋 Checklist Verifikasi

Sebelum test remote control, pastikan:

- [ ] Agent running sebagai **Administrator**
- [ ] Atau agent terinstall sebagai **Windows Service**
- [ ] Windows Firewall service **running**
- [ ] Tidak ada Group Policy yang memblokir
- [ ] Agent log menunjukkan "✅ Remote command listener active"
- [ ] Test command sederhana dulu (message, screenshot)
- [ ] Baru test command yang butuh admin (block internet, shutdown)

---

## 🎯 Quick Fix Summary

**Jika command diblokir:**

```cmd
# 1. Stop agent
# Ctrl+C

# 2. Run sebagai Administrator
# Right-click CMD → Run as Administrator

# 3. Start agent
cd C:\labmonitor-agent
npm start

# 4. Test command
# Di dashboard: Kirim command
```

**Atau install sebagai service:**

```cmd
cd C:\labmonitor-agent
npm run install-service
```

---

## 📞 Jika Masih Bermasalah

Kirim informasi ini:

1. **Cara agent dijalankan:**
   - Manual atau service?
   - Sebagai user atau admin?

2. **Error message lengkap:**
   ```cmd
   type C:\labmonitor-agent\logs\agent.log
   ```

3. **Command yang dicoba:**
   - Action apa?
   - Parameter apa?

4. **Windows version:**
   ```cmd
   winver
   ```

5. **Firewall status:**
   ```cmd
   netsh advfirewall show state
   ```

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

## ✅ Expected Result

Setelah agent running sebagai Administrator:

✅ **Block Internet** → Internet terblokir  
✅ **Unblock Internet** → Internet kembali normal  
✅ **Shutdown/Restart** → Komputer mati/restart  
✅ **Lock Screen** → Screen terkunci  
✅ **Screenshot** → Screenshot diambil  
✅ **Semua command** → Berfungsi tanpa error  

**Status: ✅ FIXED dengan run sebagai Administrator!** 🎉
