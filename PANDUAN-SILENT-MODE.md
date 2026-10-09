# 🤫 Panduan: Menjalankan Agent Tanpa Window CMD (Silent Mode)

## ✅ Status: SUDAH DIBUAT

Agent sekarang bisa berjalan **tanpa menampilkan window CMD** di layar siswa, sehingga siswa tidak bisa melihat, menutup, atau menghentikan monitoring.

---

## 🎯 Solusi yang Disediakan

### **Metode 1: VBScript Wrapper (RECOMMENDED)**

Menggunakan file `.vbs` untuk menjalankan agent tanpa console window.

**Files:**
- `run-agent.vbs` - VBScript wrapper
- `install-autostart-silent.bat` - Installer dengan silent mode

**Keuntungan:**
- ✅ Tidak ada window CMD yang terlihat
- ✅ Siswa tidak bisa menutup agent
- ✅ Agent berjalan di background
- ✅ Auto-start saat boot
- ✅ Simple dan reliable

---

## 🚀 Cara Menggunakan (3 Langkah)

### **Langkah 1: Copy Files ke PC Siswa**

```powershell
# Di server admin, copy semua file agent ke PC siswa
# Pastikan file-file ini ada:
# - run-agent.vbs
# - install-autostart-silent.bat
# - src\agent.js
# - package.json
# - .env
```

### **Langkah 2: Jalankan Installer Silent Mode**

```cmd
# Di PC siswa
cd C:\labmonitor-agent

# Right-click install-autostart-silent.bat → Run as administrator
```

**Installer akan:**
- ✅ Cek Node.js installation
- ✅ Install dependencies
- ✅ Create Task Scheduler task dengan VBScript wrapper
- ✅ Configure silent mode (no window)
- ✅ Test agent running
- ✅ Create uninstaller

### **Langkah 3: Restart Komputer untuk Test**

```cmd
# Di PC siswa
shutdown /r /t 0
```

**Setelah restart:**
- ✅ Agent auto-start dalam 30 detik
- ✅ **TIDAK ADA window CMD yang terlihat**
- ✅ Agent berjalan di background
- ✅ Cek log: `type C:\labmonitor-agent\logs\agent.log`

---

## 🔍 Verifikasi Agent Running (Tanpa Window)

### **Method 1: Cek Process**

```cmd
tasklist | findstr node
```

**Expected:**
```
node.exe    1234    Console    1    50,000 K
```

**Catatan:** Agent running tapi **TIDAK ADA cmd.exe window** yang terlihat!

### **Method 2: Cek Task Scheduler**

```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list
```

**Expected:**
```
TaskName: LabMonitor Agent
Status: Running
Run As User: SYSTEM
```

### **Method 3: Cek Agent Log**

```cmd
type C:\labmonitor-agent\logs\agent.log
```

**Expected:**
```
2026-10-08 12:00:00 info: 🚀 Agent Starting...
2026-10-08 12:00:01 info: ✅ Connected to backend
2026-10-08 12:00:01 info: ✅ Agent started successfully
```

---

## 📊 Bagaimana Cara Kerjanya?

### **Flow Silent Mode:**

```
1. Task Scheduler trigger (on startup)
   ↓
2. Execute: wscript.exe "run-agent.vbs"
   ↓
3. VBScript runs: node.exe "src\agent.js"
   ↓
4. Window style: 0 (Hidden)
   ↓
5. Agent runs in background
   ↓
6. No console window visible
   ↓
7. Students cannot see or close agent
```

### **VBScript Code:**

```vbscript
Set WshShell = CreateObject("WScript.Shell")

' Run agent without console window
' 0 = Hidden window
' False = Don't wait for process to finish
WshShell.Run "cmd.exe /c node.exe ""src\agent.js""", 0, False
```

**Penjelasan:**
- `0` = Window style hidden (tidak terlihat)
- `False` = Don't wait for process (run in background)

---

## 🎨 Perbandingan: Sebelum vs Sesudah

### **SEBELUM (dengan window CMD):**

```
┌─────────────────────────────────────────┐
│  C:\Windows\system32\cmd.exe            │
├─────────────────────────────────────────┤
│                                         │
│  C:\labmonitor-agent>npm start          │
│                                         │
│  > labmonitor-agent@1.0.0 start         │
│  > node src/agent.js                    │
│                                         │
│  🚀 LabMonitor Agent Starting...        │
│  ✅ Connected to backend                │
│  ✅ Agent started successfully          │
│                                         │
│  [Student can see this window]          │
│  [Student can close with Ctrl+C]        │
│  [Student can stop monitoring]          │
│                                         │
└─────────────────────────────────────────┘
```

### **SESUDAH (tanpa window CMD):**

```
┌─────────────────────────────────────────┐
│  Student Desktop                        │
├─────────────────────────────────────────┤
│                                         │
│  [Normal desktop - no agent window]     │
│  [Agent running in background]          │
│  [Student cannot see agent]             │
│  [Student cannot close agent]           │
│  [Monitoring continues silently]        │
│                                         │
│  💻 Student working normally            │
│  📊 Admin monitoring from dashboard     │
│  🤫 Agent invisible to student          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### **Problem 1: Agent Running Tapi Ada Window CMD**

**Penyebab:**
- Task Scheduler tidak menggunakan VBScript wrapper
- Task configured untuk run `node.exe` langsung

**Solusi:**
```cmd
# Delete old task
schtasks /delete /tn "LabMonitor Agent" /f

# Run installer silent mode
cd C:\labmonitor-agent
install-autostart-silent.bat
```

### **Problem 2: Agent Tidak Running**

**Cek 1: Task Scheduler**
```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list
```

**Cek 2: VBScript File**
```cmd
# Pastikan run-agent.vbs ada
dir C:\labmonitor-agent\run-agent.vbs
```

**Cek 3: Agent Log**
```cmd
type C:\labmonitor-agent\logs\agent.log
```

**Solusi:**
```cmd
# Run task manually
schtasks /run /tn "LabMonitor Agent"

# Atau jalankan VBScript manual
cd C:\labmonitor-agent
cscript run-agent.vbs
```

### **Problem 3: Siswa Bisa Melihat Agent Process di Task Manager**

**Penyebab:**
- Siswa buka Task Manager dan lihat `node.exe`

**Solusi:**
- **Tidak bisa dihindari 100%** - Process tetap terlihat di Task Manager
- Tapi siswa **tidak bisa close** karena agent running sebagai SYSTEM
- Agent akan auto-restart jika di-kill

**Alternative:**
- Disable Task Manager untuk siswa via Group Policy
- Atau gunakan nama process yang tidak mencurigakan

---

## 🛡️ Security & Privacy

### **Apa yang Bisa Dilakukan Siswa:**

✅ **BISA:**
- Lihat `node.exe` di Task Manager
- Lihat folder `C:\labmonitor-agent` di File Explorer
- Lihat log file di `C:\labmonitor-agent\logs`

❌ **TIDAK BISA:**
- ❌ Lihat window CMD agent
- ❌ Close agent dengan Ctrl+C
- ❌ Stop agent dari Task Manager (running as SYSTEM)
- ❌ Uninstall agent (butuh admin password)

### **Rekomendasi Tambahan:**

1. **Disable Task Manager untuk siswa:**
   ```cmd
   # Via Group Policy
   User Configuration → Administrative Templates → System → Ctrl+Alt+Del Options
   → Remove Task Manager: Enabled
   ```

2. **Hide agent folder:**
   ```cmd
   # Set folder sebagai hidden
   attrib +h C:\labmonitor-agent
   ```

3. **Rename agent folder** (optional):
   ```cmd
   # Rename ke nama yang tidak mencurigakan
   ren C:\labmonitor-agent C:\WindowsSystem32
   ```

---

## 📋 Checklist Verifikasi

Setelah install, verifikasi:

### **Silent Mode:**
- [ ] Restart komputer
- [ ] Tunggu 30-60 detik
- [ ] **TIDAK ADA window CMD yang terlihat**
- [ ] Agent running di background

### **Process Check:**
- [ ] `tasklist | findstr node` → node.exe running
- [ ] **TIDAK ADA cmd.exe window** yang terlihat
- [ ] Agent connected ke backend

### **Task Scheduler:**
- [ ] Task "LabMonitor Agent" ada
- [ ] Status: "Running"
- [ ] Run as: "SYSTEM"
- [ ] Command: `wscript.exe "run-agent.vbs"`

### **Agent Functionality:**
- [ ] Cek log: `type C:\labmonitor-agent\logs\agent.log`
- [ ] Agent connected ke backend
- [ ] Monitoring data terkirim
- [ ] Remote control berfungsi

---

## 🎯 Alternative Methods

### **Method 2: PowerShell Hidden Window**

Jika tidak ingin pakai VBScript, bisa pakai PowerShell:

```powershell
# Create PowerShell script
$script = @'
Start-Process -FilePath "node.exe" -ArgumentList "C:\labmonitor-agent\src\agent.js" -WindowStyle Hidden -WorkingDirectory "C:\labmonitor-agent"
'@

$script | Out-File "C:\labmonitor-agent\run-agent.ps1"

# Update Task Scheduler
schtasks /change /tn "LabMonitor Agent" /tr "powershell.exe -ExecutionPolicy Bypass -File C:\labmonitor-agent\run-agent.ps1"
```

### **Method 3: Python Script**

Jika punya Python installed:

```python
# run-agent.py
import subprocess
import sys

subprocess.Popen(
    [sys.executable, "src/agent.js"],
    cwd="C:\\labmonitor-agent",
    creationflags=subprocess.CREATE_NO_WINDOW
)
```

### **Method 4: Windows Service (Advanced)**

Untuk production environment, bisa convert agent ke Windows Service:

```cmd
# Install node-windows
npm install -g node-windows

# Create service
node -e "var Service = require('node-windows').Service; var svc = new Service({name: 'LabMonitor Agent', script: 'C:\\labmonitor-agent\\src\\agent.js'}); svc.on('install', function(){svc.start();}); svc.install();"
```

**Keuntungan:**
- ✅ Professional solution
- ✅ Auto-start dengan Windows
- ✅ Run as SYSTEM
- ✅ No window visible
- ✅ Easy to manage via services.msc

**Kekurangan:**
- ⚠️ Butuh node-windows package
- ⚠️ Lebih complex setup
- ⚠️ Butuh admin privilege untuk install service

---

## 📊 Comparison Table

| Method | Silent | Auto-Start | Complexity | Recommended |
|--------|--------|------------|------------|-------------|
| **VBScript Wrapper** | ✅ Yes | ✅ Yes | ⭐ Simple | ✅ **YES** |
| PowerShell Hidden | ✅ Yes | ✅ Yes | ⭐⭐ Medium | ⚠️ Alternative |
| Python Script | ✅ Yes | ✅ Yes | ⭐⭐ Medium | ⚠️ Alternative |
| Windows Service | ✅ Yes | ✅ Yes | ⭐⭐⭐ Complex | ⚠️ Production only |

---

## ✅ Summary

**Files yang Sudah Dibuat:**

| File | Fungsi |
|------|--------|
| `run-agent.vbs` | ✅ VBScript wrapper untuk run agent tanpa window |
| `install-autostart-silent.bat` | ✅ Installer dengan silent mode |

**Cara Pakai:**

1. ✅ Copy `run-agent.vbs` dan `install-autostart-silent.bat` ke PC siswa
2. ✅ Right-click `install-autostart-silent.bat` → Run as administrator
3. ✅ Restart komputer
4. ✅ Agent auto-start **tanpa window CMD**

**Expected Result:**

✅ Agent running di background  
✅ **TIDAK ADA window CMD yang terlihat**  
✅ Siswa tidak bisa close agent  
✅ Monitoring continues silently  
✅ Auto-start saat boot  

**Status:** ✅ **READY TO USE** 🎉

**Catatan:** Siswa masih bisa lihat `node.exe` di Task Manager, tapi tidak bisa close karena agent running sebagai SYSTEM. Untuk full security, disable Task Manager via Group Policy.
