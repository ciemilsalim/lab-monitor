# 🔧 Troubleshooting: Auto-Start Agent

## ❌ Masalah

Agent tidak auto-start saat komputer siswa dinyalakan.

---

## ✅ Solusi 1: Gunakan Installer Baru (RECOMMENDED)

Saya sudah buatkan installer yang lebih simple menggunakan **Task Scheduler**:

### **Langkah Instalasi:**

1. **Copy installer ke PC siswa:**
   ```powershell
   copy agent\install-autostart-simple.bat \\PC-13\C$\labmonitor-agent\
   ```

2. **Jalankan installer di PC siswa:**
   ```cmd
   # Di PC siswa
   cd C:\labmonitor-agent
   
   # Right-click install-autostart-simple.bat → Run as administrator
   ```

3. **Tunggu sampai selesai** (1-2 menit)

4. **Restart komputer** untuk test auto-start

---

## ✅ Solusi 2: Manual Setup Task Scheduler

Jika installer tidak bekerja, setup manual:

### **Langkah 1: Buka Task Scheduler**

```cmd
# Tekan Win + R
# Ketik: taskschd.msc
# Tekan Enter
```

### **Langkah 2: Create Basic Task**

1. Di panel kanan, klik **"Create Basic Task..."**
2. **Name:** `LabMonitor Agent`
3. **Description:** `LabMonitor Agent - Monitoring PC Siswa`
4. Klik **Next**

### **Langkah 3: Set Trigger**

1. **Trigger:** Pilih **"When the computer starts"**
2. Klik **Next**

### **Langkah 4: Set Action**

1. **Action:** Pilih **"Start a program"**
2. Klik **Next**
3. **Program/script:** 
   ```
   C:\Program Files\nodejs\node.exe
   ```
   (atau path node.js Anda - cek dengan `where node`)
4. **Add arguments:**
   ```
   "C:\labmonitor-agent\src\agent.js"
   ```
5. **Start in:**
   ```
   C:\labmonitor-agent
   ```
6. Klik **Next**

### **Langkah 5: Finish**

1. Centang **"Open the Properties dialog when I click Finish"**
2. Klik **Finish**

### **Langkah 6: Set Properties**

1. Di tab **"General"**:
   - ✅ Centang **"Run with highest privileges"**
   - ✅ Pilih **"Run whether user is logged on or not"**
   - **Configure for:** Windows 10

2. Di tab **"Conditions"**:
   - ❌ Uncheck **"Start the task only if the computer is on AC power"**
   - ❌ Uncheck **"Start the task only if the network connection is available"**

3. Di tab **"Settings"**:
   - ✅ Centang **"Allow task to be run on demand"**
   - ✅ Centang **"Run task as soon as possible after a scheduled start is missed"**
   - ✅ Centang **"If the task fails, restart every: 1 minute"**
   - **Attempt to restart up to: 3 times**
   - ✅ Centang **"If the running task does not end when requested, force it to stop"**

4. Klik **OK**

### **Langkah 7: Test Task**

```cmd
# Di Task Scheduler
# Klik kanan "LabMonitor Agent"
# Pilih "Run"

# Cek apakah agent running:
tasklist | findstr node
```

**Expected:** `node.exe` muncul di list

---

## ✅ Solusi 3: Setup via Command Line

Jika ingin setup via command line:

### **Step 1: Get Node.js Path**

```cmd
where node
```

**Output example:**
```
C:\Program Files\nodejs\node.exe
```

### **Step 2: Create Task**

```cmd
schtasks /create /tn "LabMonitor Agent" /tr "\"C:\Program Files\nodejs\node.exe\" \"C:\labmonitor-agent\src\agent.js\"" /sc onstart /ru SYSTEM /rl highest /delay 0000:30 /f
```

### **Step 3: Configure Task**

```cmd
# Set to run whether user is logged on or not
schtasks /change /tn "LabMonitor Agent" /ru SYSTEM

# Set to restart on failure
schtasks /change /tn "LabMonitor Agent" /ri 1 /k
```

### **Step 4: Test Task**

```cmd
# Run task manually
schtasks /run /tn "LabMonitor Agent"

# Check status
schtasks /query /tn "LabMonitor Agent"

# Verify agent running
tasklist | findstr node
```

---

## 🔍 Troubleshooting

### **Problem 1: Task Tidak Muncul di Task Scheduler**

**Penyebab:**
- Installer tidak berjalan sebagai Administrator
- Path node.js atau agent.js salah

**Solusi:**
```cmd
# Cek apakah task ada
schtasks /query /tn "LabMonitor Agent"

# Jika tidak ada, create manual (lihat Solusi 2 atau 3)
```

---

### **Problem 2: Task Ada Tapi Tidak Running**

**Cek 1: Task Status**
```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list
```

**Expected:**
```
Status: Running
Last Run Time: [timestamp]
Last Result: 0
```

**Cek 2: Agent Process**
```cmd
tasklist | findstr node
```

**Expected:** `node.exe` muncul

**Cek 3: Agent Log**
```cmd
type C:\labmonitor-agent\logs\agent.log
```

**Expected:**
```
🚀 LabMonitor Agent Starting...
✅ Connected to backend
✅ Agent started successfully
```

**Solusi:**
```cmd
# Run task manually
schtasks /run /tn "LabMonitor Agent"

# Atau restart komputer
shutdown /r /t 0
```

---

### **Problem 3: Agent Running Tapi Tidak Connect ke Server**

**Cek 1: Agent Log**
```cmd
type C:\labmonitor-agent\logs\agent.log
```

**Cari error:**
- `Connection error` → Backend URL salah
- `ECONNREFUSED` → Backend tidak running
- `Max reconnection attempts` → Network problem

**Cek 2: Backend URL di .env**
```cmd
type C:\labmonitor-agent\.env
```

**Expected:**
```
BACKEND_URL=http://192.168.100.166:3001
```

**Cek 3: Test Koneksi**
```cmd
# Test ping ke server
ping 192.168.100.166

# Test backend API
curl http://192.168.100.166:3001/health
```

**Solusi:**
- Update `BACKEND_URL` di `.env`
- Restart agent
- Cek firewall

---

### **Problem 4: Task Tidak Auto-Start Setelah Restart**

**Penyebab:**
- Task configuration salah
- Delay terlalu lama
- Task disabled

**Cek 1: Task Configuration**
```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list
```

**Expected:**
```
Status: Ready
Trigger Type: At startup
Delay: 30 seconds
Run As User: SYSTEM
```

**Cek 2: Task Enabled**
```cmd
schtasks /change /tn "LabMonitor Agent" /enable
```

**Cek 3: Test Manual**
```cmd
# Run task manually
schtasks /run /tn "LabMonitor Agent"

# Restart komputer
shutdown /r /t 0

# Setelah restart, cek agent
tasklist | findstr node
```

**Solusi:**
- Reduce delay ke 10 detik:
  ```cmd
  schtasks /change /tn "LabMonitor Agent" /delay 0000:10
  ```
- Enable task
- Restart komputer

---

### **Problem 5: Agent Crash Setelah Start**

**Cek 1: Agent Log**
```cmd
type C:\labmonitor-agent\logs\agent.log
```

**Cari error:**
- `Error: Cannot find module` → Dependencies tidak terinstall
- `EACCES: permission denied` → Agent tidak running sebagai Administrator
- `Unhandled exception` → Bug di code

**Cek 2: Dependencies**
```cmd
cd C:\labmonitor-agent
npm install
```

**Cek 3: Run as Administrator**
```cmd
# Stop agent
taskkill /F /IM node.exe

# Start manual sebagai Administrator
cd C:\labmonitor-agent
# Right-click Command Prompt → Run as Administrator
npm start
```

**Solusi:**
- Install dependencies: `npm install`
- Pastikan task run as SYSTEM
- Cek agent log untuk detail error

---

## 📊 Verification Checklist

Setelah setup, verifikasi:

### **Task Scheduler:**
- [ ] Task "LabMonitor Agent" ada
- [ ] Status: "Ready" atau "Running"
- [ ] Trigger: "At startup"
- [ ] Run as: "SYSTEM"
- [ ] Delay: 30 seconds (atau kurang)
- [ ] Auto-restart on failure: Enabled

### **Agent Process:**
- [ ] `node.exe` running (cek: `tasklist | findstr node`)
- [ ] Agent log ada dan tidak ada error
- [ ] Agent connected ke backend

### **Auto-Start:**
- [ ] Restart komputer
- [ ] Tunggu 30-60 detik
- [ ] Cek `node.exe` running
- [ ] Cek agent log: "Agent started successfully"

---

## 🛠️ Debug Commands

### **Check Task Status:**
```cmd
schtasks /query /tn "LabMonitor Agent" /v /fo list
```

### **Run Task Manually:**
```cmd
schtasks /run /tn "LabMonitor Agent"
```

### **Stop Task:**
```cmd
schtasks /end /tn "LabMonitor Agent"
```

### **Delete Task:**
```cmd
schtasks /delete /tn "LabMonitor Agent" /f
```

### **Check Agent Process:**
```cmd
tasklist | findstr node
```

### **Kill Agent Process:**
```cmd
taskkill /F /IM node.exe
```

### **Check Agent Log:**
```cmd
type C:\labmonitor-agent\logs\agent.log
```

### **Test Backend Connection:**
```cmd
curl http://192.168.100.166:3001/health
```

---

## 🎯 Quick Fix

Jika agent tidak auto-start, coba langkah ini:

### **Step 1: Delete Old Task**
```cmd
schtasks /delete /tn "LabMonitor Agent" /f
```

### **Step 2: Run Installer**
```cmd
cd C:\labmonitor-agent
# Right-click install-autostart-simple.bat → Run as administrator
```

### **Step 3: Verify**
```cmd
# Check task
schtasks /query /tn "LabMonitor Agent"

# Run manually
schtasks /run /tn "LabMonitor Agent"

# Check process
tasklist | findstr node
```

### **Step 4: Test Auto-Start**
```cmd
# Restart komputer
shutdown /r /t 0

# Setelah restart, tunggu 30-60 detik
# Cek agent
tasklist | findstr node
```

---

## 📞 Jika Masih Bermasalah

Kirim informasi ini:

1. **Output dari command:**
   ```cmd
   schtasks /query /tn "LabMonitor Agent" /v /fo list
   tasklist | findstr node
   type C:\labmonitor-agent\logs\agent.log
   ```

2. **Screenshot Task Scheduler:**
   - Buka Task Scheduler
   - Screenshot properties task "LabMonitor Agent"

3. **Windows version:**
   ```cmd
   winver
   ```

4. **Node.js version:**
   ```cmd
   node --version
   ```

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

## ✅ Expected Result

Setelah setup berhasil:

✅ **Task Scheduler:**
- Task "LabMonitor Agent" ada dan enabled
- Trigger: "At startup" dengan delay 30 detik
- Run as: SYSTEM

✅ **Agent Process:**
- `node.exe` running setelah boot
- Agent connected ke backend
- Agent log menunjukkan "Agent started successfully"

✅ **Auto-Start:**
- Restart komputer → agent auto-start
- Tidak perlu manual start
- Agent reconnect otomatis jika disconnect

---

**Status:** ✅ **SOLUSI DISEDIAKAN** 🎉

Gunakan installer baru `install-autostart-simple.bat` atau setup manual via Task Scheduler. Jika masih bermasalah, ikuti troubleshooting guide di atas.
