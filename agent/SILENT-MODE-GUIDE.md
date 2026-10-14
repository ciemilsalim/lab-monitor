# 🚀 LabMonitor Agent - Silent Mode Guide

## 📋 Overview

Agent sekarang bisa berjalan di **background tanpa window CMD** yang terlihat. Ini berguna untuk:
- Deployment ke komputer siswa tanpa mengganggu
- Auto-start saat boot tanpa window muncul
- Monitoring yang tidak terlihat oleh user

---

## 🎯 Cara Menggunakan

### **Method 1: Start Silent (Recommended)**

```bash
# Double-click file ini:
start-silent.bat
```

**What happens:**
- ✅ Agent start di background
- ✅ Window CMD otomatis hilang setelah 3 detik
- ✅ Agent tetap running
- ✅ Tidak ada window yang terlihat

**To verify agent running:**
```bash
# Check process
tasklist | findstr node

# Expected output:
node.exe    1234    Console    1    50,000 K
```

---

### **Method 2: Start Normal (dengan window)**

```bash
npm start
```

**What happens:**
- ✅ Agent start dengan window CMD terlihat
- ✅ Bisa lihat log real-time
- ✅ Window tetap terbuka selama agent running

**When to use:**
- Debugging
- Testing
- Monitoring log

---

### **Method 3: Auto-start dengan Task Scheduler**

```bash
# Double-click file ini:
install-autostart-simple.bat
```

**What happens:**
- ✅ Agent auto-start saat komputer boot
- ✅ Berjalan di background (silent)
- ✅ Tidak perlu login user
- ✅ Running sebagai SYSTEM

---

## 🛠️ Management Scripts

### **1. start-silent.bat**
Start agent di background tanpa window.

```bash
start-silent.bat
```

### **2. stop-agent.bat**
Stop agent yang sedang running.

```bash
stop-agent.bat
```

### **3. status-agent.bat**
Check status agent dan lihat log terakhir.

```bash
status-agent.bat
```

### **4. install-autostart-simple.bat**
Setup auto-start dengan Task Scheduler.

```bash
install-autostart-simple.bat
```

### **5. run-agent-silent.vbs**
VBScript wrapper untuk run agent hidden.
(Digunakan oleh start-silent.bat)

---

## 📊 Comparison: Silent vs Normal

| Feature | Silent Mode | Normal Mode |
|---------|-------------|-------------|
| **Window CMD** | ❌ Tidak ada | ✅ Terlihat |
| **Log real-time** | ❌ Tidak bisa lihat | ✅ Bisa lihat |
| **Start command** | `start-silent.bat` | `npm start` |
| **Stop command** | `stop-agent.bat` | `Ctrl+C` |
| **Use case** | Production, Deployment | Development, Testing |
| **User visible** | ❌ Tidak | ✅ Ya |

---

## 🔍 Troubleshooting

### **Problem: Agent tidak start di silent mode**

**Check 1: File exists**
```bash
dir run-agent-silent.vbs
dir src\agent.js
```

**Check 2: VBScript error**
```bash
# Run VBScript manually
cscript run-agent-silent.vbs
```

**Check 3: Node.js installed**
```bash
node --version
```

**Solution:**
- Pastikan semua file ada
- Install Node.js jika belum ada
- Run sebagai Administrator

---

### **Problem: Agent running tapi tidak connect ke backend**

**Check 1: Backend running**
```bash
curl http://localhost:3001/health
```

**Check 2: Agent log**
```bash
type logs\agent.log
```

**Check 3: Network connection**
```bash
ping 192.168.100.166
```

**Solution:**
- Start backend dulu
- Check .env configuration
- Check network connection

---

### **Problem: Tidak bisa stop agent**

**Check 1: Process exists**
```bash
tasklist | findstr node
```

**Check 2: Permission**
```bash
# Run as Administrator
stop-agent.bat
```

**Manual stop:**
```bash
taskkill /F /IM node.exe
```

---

## 🎨 Workflow

### **Development Workflow:**
```
1. npm start (normal mode)
   ↓
2. Test & debug
   ↓
3. Ctrl+C to stop
   ↓
4. Repeat
```

### **Production Workflow:**
```
1. start-silent.bat
   ↓
2. Agent running di background
   ↓
3. Verify: status-agent.bat
   ↓
4. Close CMD window
   ↓
5. Agent tetap running
```

### **Deployment Workflow:**
```
1. Copy agent folder ke PC siswa
   ↓
2. install-autostart-simple.bat
   ↓
3. Agent auto-start saat boot
   ↓
4. Silent mode (no window)
   ↓
5. Done!
```

---

## 📝 Advanced: Custom Silent Start

Jika ingin custom silent start, edit `run-agent-silent.vbs`:

```vbscript
' Change working directory
WshShell.CurrentDirectory = "C:\path\to\agent"

' Change node path
strNodePath = "C:\Program Files\nodejs\node.exe"

' Change agent script
strAgentScript = "C:\path\to\agent\src\agent.js"

' Run with hidden window
WshShell.Run "cmd /c """ & strNodePath & """ """ & strAgentScript & """", 0, False
```

---

## 🔐 Security Notes

### **Silent Mode Security:**

✅ **Students cannot:**
- ❌ See agent window
- ❌ Close agent with Ctrl+C
- ❌ See agent logs
- ❌ Stop agent easily

⚠️ **Students can:**
- ✅ See `node.exe` in Task Manager
- ✅ See `C:\labmonitor-agent` folder
- ✅ See log files if they know where to look

### **Additional Security (Optional):**

1. **Hide agent folder:**
   ```bash
   attrib +h C:\labmonitor-agent
   ```

2. **Rename agent folder:**
   ```bash
   ren C:\labmonitor-agent C:\WindowsSystem32
   ```

3. **Disable Task Manager:**
   - Via Group Policy
   - User Configuration → Administrative Templates → System → Ctrl+Alt+Del Options
   - Remove Task Manager: Enabled

---

## 📚 Related Documentation

- `PANDUAN-SWITCH-MODE.md` - Switch between visible/silent mode
- `PANDUAN-SILENT-MODE.md` - Detailed silent mode guide
- `TROUBLESHOOTING-AUTOSTART.md` - Auto-start troubleshooting
- `FIX-STATUS-TRACKING.md` - Status tracking fix

---

## ✅ Summary

**Files Created:**
- ✅ `start-silent.bat` - Start agent di background
- ✅ `run-agent-silent.vbs` - VBScript wrapper
- ✅ `stop-agent.bat` - Stop agent
- ✅ `status-agent.bat` - Check status
- ✅ `SILENT-MODE-GUIDE.md` - This file

**How to Use:**
1. **Start silent:** `start-silent.bat`
2. **Check status:** `status-agent.bat`
3. **Stop agent:** `stop-agent.bat`

**Expected Result:**
- ✅ Agent running di background
- ✅ Tidak ada window CMD
- ✅ Siswa tidak bisa lihat agent
- ✅ Agent tetap running setelah close CMD

**Status:** ✅ **READY TO USE** 🚀

---

**Last Updated:** 8 Oktober 2026  
**Developer:** zahradev  
**Version:** 1.0  
**Status:** ✅ Production Ready
