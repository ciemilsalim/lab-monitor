# 🔄 Panduan: Switch Mode (Visible ↔ Silent)

## 🎯 Konsep

Sistem **switch mode** memungkinkan Anda untuk:
1. **Install dengan VISIBLE mode** - Lihat progress CMD saat instalasi
2. **Switch ke SILENT mode** - Setelah yakin semua berjalan, sembunyikan CMD
3. **Switch balik ke VISIBLE mode** - Jika perlu debugging

---

## 📦 Files yang Tersedia

| File | Fungsi |
|------|--------|
| `install-autostart-simple.bat` | ✅ Installer awal (VISIBLE mode) |
| `switch-to-silent.bat` | ✅ Switch ke SILENT mode (no CMD) |
| `switch-to-visible.bat` | ✅ Switch ke VISIBLE mode (with CMD) |
| `run-agent.vbs` | ✅ VBScript wrapper untuk silent mode |

---

## 🚀 Workflow yang Direkomendasikan

### **Phase 1: Instalasi (VISIBLE Mode)**

```
1. Copy semua file agent ke PC siswa
2. Jalankan: install-autostart-simple.bat
3. Lihat progress instalasi di CMD
4. Verify agent running dengan CMD window
5. Test semua fitur (monitoring, screenshot, dll)
```

**Expected:**
- ✅ CMD window terlihat
- ✅ Bisa lihat log agent real-time
- ✅ Bisa debug jika ada masalah

### **Phase 2: Production (SILENT Mode)**

```
1. Setelah yakin semua berjalan normal
2. Jalankan: switch-to-silent.bat
3. Agent switch ke background (no CMD)
4. Verify agent masih running
5. Done! Siswa tidak bisa lihat agent
```

**Expected:**
- ✅ CMD window hilang
- ✅ Agent masih running di background
- ✅ Siswa tidak bisa lihat/close agent

### **Phase 3: Debugging (VISIBLE Mode)**

```
1. Jika ada masalah atau perlu debug
2. Jalankan: switch-to-visible.bat
3. Agent switch kembali ke visible mode
4. Lihat log dan debug
5. Setelah selesai, switch balik ke silent
```

**Expected:**
- ✅ CMD window muncul lagi
- ✅ Bisa lihat log real-time
- ✅ Bisa debug masalah

---

## 📋 Langkah Detail

### **Step 1: Install dengan VISIBLE Mode**

```cmd
# Di PC siswa
cd C:\labmonitor-agent

# Right-click install-autostart-simple.bat → Run as administrator
```

**What happens:**
- ✅ Installer berjalan dengan CMD window
- ✅ Bisa lihat progress instalasi
- ✅ Task Scheduler task dibuat (visible mode)
- ✅ Agent running dengan CMD window

**Verify:**
```cmd
# Cek agent running
tasklist | findstr node

# Cek Task Scheduler
schtasks /query /tn "LabMonitor Agent" /v /fo list

# Lihat log
type C:\labmonitor-agent\logs\agent.log
```

---

### **Step 2: Switch ke SILENT Mode**

```cmd
# Di PC siswa
cd C:\labmonitor-agent

# Right-click switch-to-silent.bat → Run as administrator
```

**What happens:**
- ✅ Stop agent current
- ✅ Delete old task (visible mode)
- ✅ Create new task (silent mode dengan VBScript)
- ✅ Start agent tanpa CMD window

**Verify:**
```cmd
# Cek agent running (node.exe ada, tapi TIDAK ADA cmd.exe window)
tasklist | findstr node

# Cek Task Scheduler (command harus: wscript.exe "run-agent.vbs")
schtasks /query /tn "LabMonitor Agent" /v /fo list

# Lihat log
type C:\labmonitor-agent\logs\agent.log
```

**Expected Result:**
- ✅ Agent running
- ✅ **TIDAK ADA CMD window yang terlihat**
- ✅ Siswa tidak bisa lihat agent

---

### **Step 3: Switch Balik ke VISIBLE Mode (Jika Perlu)**

```cmd
# Di PC siswa
cd C:\labmonitor-agent

# Right-click switch-to-visible.bat → Run as administrator
```

**What happens:**
- ✅ Stop agent current
- ✅ Delete old task (silent mode)
- ✅ Create new task (visible mode dengan node.exe langsung)
- ✅ Start agent dengan CMD window

**Verify:**
```cmd
# Cek agent running (node.exe DAN cmd.exe window terlihat)
tasklist | findstr node

# Cek Task Scheduler (command harus: node.exe "src\agent.js")
schtasks /query /tn "LabMonitor Agent" /v /fo list
```

**Expected Result:**
- ✅ Agent running
- ✅ **CMD window terlihat**
- ✅ Bisa lihat log real-time

---

## 🔍 Cara Cek Mode Saat Ini

### **Method 1: Cek Task Scheduler Command**

```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list | findstr "Task To Run"
```

**Jika output:**
- `wscript.exe "run-agent.vbs"` → **SILENT mode**
- `node.exe "src\agent.js"` → **VISIBLE mode**

### **Method 2: Cek Process**

```cmd
tasklist | findstr "node.exe cmd.exe"
```

**Jika output:**
- Hanya `node.exe` → **SILENT mode** (tidak ada cmd.exe window)
- `node.exe` DAN `cmd.exe` → **VISIBLE mode** (ada cmd.exe window)

### **Method 3: Cek Visual**

- **SILENT mode:** Tidak ada window CMD yang terlihat di layar
- **VISIBLE mode:** Ada window CMD dengan log agent

---

## 📊 Comparison Table

| Feature | VISIBLE Mode | SILENT Mode |
|---------|--------------|-------------|
| **CMD Window** | ✅ Terlihat | ❌ Tidak terlihat |
| **Student Can See** | ✅ Ya | ❌ Tidak |
| **Student Can Close** | ✅ Ya (Ctrl+C) | ❌ Tidak |
| **Debug Friendly** | ✅ Ya | ❌ Tidak |
| **Production Ready** | ❌ Tidak | ✅ Ya |
| **Auto-Start** | ✅ Ya | ✅ Ya |
| **Running as SYSTEM** | ✅ Ya | ✅ Ya |

---

## 🎯 Kapan Gunakan Setiap Mode?

### **VISIBLE Mode - Gunakan Saat:**

✅ **Instalasi awal**
- Bisa lihat progress instalasi
- Bisa debug jika ada error
- Bisa verify agent running

✅ **Testing & Debugging**
- Bisa lihat log real-time
- Bisa test fitur baru
- Bisa troubleshoot masalah

✅ **Maintenance**
- Bisa monitor agent health
- Bisa cek koneksi ke backend
- Bisa update konfigurasi

### **SILENT Mode - Gunakan Saat:**

✅ **Production**
- Agent sudah tested dan working
- Siap untuk deploy ke siswa
- Tidak ingin siswa lihat agent

✅ **Daily Operation**
- Monitoring berjalan normal
- Tidak perlu debug
- Siswa tidak boleh ganggu agent

✅ **Exam/Testing Session**
- Siswa sedang ujian
- Agent monitoring silently
- Tidak ada distraksi

---

## 🔄 Quick Switch Commands

### **Switch ke SILENT:**
```cmd
cd C:\labmonitor-agent
switch-to-silent.bat
```

### **Switch ke VISIBLE:**
```cmd
cd C:\labmonitor-agent
switch-to-visible.bat
```

### **Check Current Mode:**
```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list | findstr "Task To Run"
```

---

## 🛡️ Security Notes

### **SILENT Mode Security:**

✅ **Students Cannot:**
- ❌ See agent window
- ❌ Close agent with Ctrl+C
- ❌ Stop agent from Task Manager (running as SYSTEM)
- ❌ Uninstall agent (need admin password)

⚠️ **Students Can:**
- ✅ See `node.exe` in Task Manager
- ✅ See `C:\labmonitor-agent` folder
- ✅ See log files

### **Additional Security (Optional):**

1. **Disable Task Manager:**
   ```cmd
   # Via Group Policy
   User Configuration → Administrative Templates → System → Ctrl+Alt+Del Options
   → Remove Task Manager: Enabled
   ```

2. **Hide Agent Folder:**
   ```cmd
   attrib +h C:\labmonitor-agent
   ```

3. **Rename Agent Folder:**
   ```cmd
   ren C:\labmonitor-agent C:\WindowsSystem32
   ```

---

## 🧪 Testing Workflow

### **Test 1: Install & Verify (VISIBLE)**

```cmd
# 1. Install
install-autostart-simple.bat

# 2. Verify
tasklist | findstr node
schtasks /query /tn "LabMonitor Agent"
type C:\labmonitor-agent\logs\agent.log

# Expected:
# ✅ CMD window visible
# ✅ Agent running
# ✅ Logs showing "Agent started successfully"
```

### **Test 2: Switch to SILENT**

```cmd
# 1. Switch
switch-to-silent.bat

# 2. Verify
tasklist | findstr node
schtasks /query /tn "LabMonitor Agent" /v /fo list | findstr "Task To Run"

# Expected:
# ✅ CMD window GONE
# ✅ Agent still running
# ✅ Task command: wscript.exe "run-agent.vbs"
```

### **Test 3: Switch Back to VISIBLE**

```cmd
# 1. Switch
switch-to-visible.bat

# 2. Verify
tasklist | findstr node
schtasks /query /tn "LabMonitor Agent" /v /fo list | findstr "Task To Run"

# Expected:
# ✅ CMD window visible again
# ✅ Agent running
# ✅ Task command: node.exe "src\agent.js"
```

---

## 📝 Troubleshooting

### **Problem: Switch Script Error**

**Error:** "File not found"

**Solusi:**
```cmd
# Pastikan semua files ada
dir C:\labmonitor-agent\*.bat
dir C:\labmonitor-agent\run-agent.vbs
```

**Expected files:**
- ✅ `install-autostart-simple.bat`
- ✅ `switch-to-silent.bat`
- ✅ `switch-to-visible.bat`
- ✅ `run-agent.vbs`

### **Problem: Agent Not Running After Switch**

**Solusi:**
```cmd
# Check task
schtasks /query /tn "LabMonitor Agent"

# Run manually
schtasks /run /tn "LabMonitor Agent"

# Check log
type C:\labmonitor-agent\logs\agent.log
```

### **Problem: Mode Not Changing**

**Solusi:**
```cmd
# Delete task completely
schtasks /delete /tn "LabMonitor Agent" /f

# Stop agent
taskkill /F /IM node.exe

# Run switch script again
switch-to-silent.bat
# atau
switch-to-visible.bat
```

---

## ✅ Best Practices

### **Recommended Workflow:**

1. **Development/Testing:**
   - Use VISIBLE mode
   - Monitor logs real-time
   - Debug issues quickly

2. **Pre-Production:**
   - Test all features in VISIBLE mode
   - Verify all commands work
   - Check all monitoring data

3. **Production:**
   - Switch to SILENT mode
   - Verify agent running silently
   - Monitor from dashboard only

4. **Maintenance:**
   - Switch to VISIBLE mode if needed
   - Debug issues
   - Switch back to SILENT when done

### **Tips:**

✅ **Always test in VISIBLE mode first**
- Easier to debug
- Can see errors immediately
- Verify all features working

✅ **Switch to SILENT only after testing**
- Ensure agent stable
- Ensure all features working
- Ensure no errors in logs

✅ **Keep switch scripts handy**
- Store in easy-to-access location
- Document location for IT team
- Train IT staff on how to use

✅ **Monitor agent health regularly**
- Check logs periodically
- Verify agent running
- Check dashboard data

---

## 📞 Support

### **Quick Reference:**

| Action | Command |
|--------|---------|
| **Install (VISIBLE)** | `install-autostart-simple.bat` |
| **Switch to SILENT** | `switch-to-silent.bat` |
| **Switch to VISIBLE** | `switch-to-visible.bat` |
| **Check Mode** | `schtasks /query /tn "LabMonitor Agent" /v /fo list` |
| **Check Process** | `tasklist \| findstr node` |
| **Check Log** | `type C:\labmonitor-agent\logs\agent.log` |

### **Documentation:**

- `PANDUAN-SILENT-MODE.md` - Detailed silent mode guide
- `TROUBLESHOOTING-AUTOSTART.md` - Auto-start troubleshooting
- `FIX-MOUSE-KEYBOARD-CONTROL.md` - Remote control guide

---

## ✅ Summary

**Files yang Sudah Dibuat:**

| File | Fungsi |
|------|--------|
| `install-autostart-simple.bat` | ✅ Installer awal (VISIBLE mode) |
| `switch-to-silent.bat` | ✅ Switch ke SILENT mode |
| `switch-to-visible.bat` | ✅ Switch ke VISIBLE mode |
| `run-agent.vbs` | ✅ VBScript wrapper untuk silent mode |

**Workflow:**

1. ✅ Install dengan VISIBLE mode (lihat progress)
2. ✅ Test semua fitur
3. ✅ Switch ke SILENT mode (production)
4. ✅ Switch ke VISIBLE mode jika perlu debug
5. ✅ Switch balik ke SILENT mode

**Status:** ✅ **READY TO USE** 🎉

**Keuntungan:**
- ✅ Fleksibel - bisa switch sesuai kebutuhan
- ✅ Easy debugging - visible mode untuk troubleshooting
- ✅ Production ready - silent mode untuk deployment
- ✅ Student-proof - siswa tidak bisa close agent di silent mode
