# 🚀 INSTALASI LENGKAP - Copy Paste Ready

## 📋 File yang Sudah Dibuat

✅ **backend-server-complete.js** - Backend server lengkap  
✅ **agent-complete.js** - Agent lengkap dengan screenshot  

---

## 🔧 LANGKAH 1: Update Backend Server

### **Lokasi File:**
```
D:\labmonitor-backend\src\server.js
```

### **Cara Update:**

**Option A: Replace File (RECOMMENDED)**

1. Buka File Explorer
2. Navigate ke: `D:\labmonitor-backend\src\`
3. **Backup file lama:**
   - Rename `server.js` → `server.js.backup`
4. **Copy file baru:**
   - Copy file `agent/backend-server-complete.js` dari project ini
   - Paste ke `D:\labmonitor-backend\src\`
   - Rename → `server.js`

**Option B: Copy Paste Manual**

1. Buka file `agent/backend-server-complete.js` di project ini
2. **Select All** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. Buka `D:\labmonitor-backend\src\server.js`
5. **Select All** (Ctrl+A)
6. **Delete** (Delete key)
7. **Paste** (Ctrl+V)
8. **Save** (Ctrl+S)

### **Restart Backend:**

```powershell
# Di terminal backend
cd D:\labmonitor-backend

# Stop (Ctrl+C)

# Start lagi
npm run dev
```

### **Expected Output:**

```
🚀 ========================================
🚀 LabMonitor Backend Server
🚀 ========================================
📡 Local:   http://localhost:3001
📡 Network: http://192.168.100.166:3001
💚 Health:  http://localhost:3001/health
🚀 ========================================

✅ Socket.io ready for connections
✅ Database save enabled for real-time data
✅ Screenshot feature enabled
✅ Remote control relay enabled
```

---

## 🔧 LANGKAH 2: Update Agent di PC-13

### **Lokasi File:**
```
C:\labmonitor-agent\src\agent.js
```

### **Cara Update:**

**Option A: Replace File (RECOMMENDED)**

1. Di PC-13, buka File Explorer
2. Navigate ke: `C:\labmonitor-agent\src\`
3. **Backup file lama:**
   - Rename `agent.js` → `agent.js.backup`
4. **Copy file baru:**
   - Copy file `agent/agent-complete.js` dari project ini
   - Paste ke `C:\labmonitor-agent\src\`
   - Rename → `agent.js`

**Option B: Copy Paste Manual**

1. Buka file `agent/agent-complete.js` di project ini
2. **Select All** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. Di PC-13, buka `C:\labmonitor-agent\src\agent.js`
5. **Select All** (Ctrl+A)
6. **Delete** (Delete key)
7. **Paste** (Ctrl+V)
8. **Save** (Ctrl+S)

### **Restart Agent:**

```cmd
# Di PC-13, buka Command Prompt sebagai Administrator

# Stop agent (Ctrl+C)

# Start lagi
cd C:\labmonitor-agent
npm start
```

### **Expected Output:**

```
🚀 ========================================
🚀 LabMonitor Agent Starting...
🚀 Computer ID: PC-13
🚀 Student ID: LAB13
🚀 ========================================
✅ Connected to backend
✅ Agent started successfully
✅ Monitoring started
✅ Remote command listener active
✅ Screenshot listener active
```

---

## 🧪 LANGKAH 3: Test Screenshot

### **Test 1: Request Screenshot**

1. Buka dashboard admin: **http://localhost:3000**
2. Login sebagai admin
3. Klik komputer **PC-13**
4. Tab **"Kontrol"**
5. Klik tombol **"Lihat Layar"** 👁️

### **Expected Result:**

**Browser Console (F12):**
```
📸 Requesting screenshot from: PC-13
📸 Screenshot captured: PC-13
```

**Backend Log (Terminal Backend):**
```
📸 Screenshot request received for: PC-13
📸 Computer: Komputer 13
📸 Student: Siswa Lab 13
📸 Screenshot captured from: PC-13
📸 Image size: 1,234.56 KB
```

**Agent Log (Terminal Agent PC-13):**
```
📸 ========================================
📸 Screenshot request received
📸 Computer: Komputer 13
📸 Student: Siswa Lab 13
📸 ========================================
📸 Executing VIEW SCREEN / SCREENSHOT command
✅ Screenshot saved to: C:\Users\...\labmonitor_screenshot_*.png
✅ Screenshot sent to backend
✅ Image size: 1,234.56 KB
```

**Di Dashboard:**
- ✅ Modal screenshot muncul otomatis
- ✅ Gambar screenshot tampil
- ✅ Info komputer & siswa muncul
- ✅ Tombol download & fullscreen tersedia

---

## 📊 Checklist Verifikasi

### **Backend:**
- [ ] File `server.js` sudah diupdate
- [ ] Backend restart tanpa error
- [ ] Log menunjukkan "✅ Screenshot feature enabled"
- [ ] Log menunjukkan "✅ Remote control relay enabled"

### **Agent:**
- [ ] File `agent.js` sudah diupdate
- [ ] Agent restart tanpa error
- [ ] Log menunjukkan "✅ Screenshot listener active"
- [ ] Log menunjukkan "✅ Remote command listener active"

### **Frontend:**
- [ ] File sudah diupdate (dari project ini)
- [ ] Frontend restart
- [ ] Browser Console tidak ada error
- [ ] Socket connected (indicator "Live" di header)

### **Test:**
- [ ] Klik "Lihat Layar" → Screenshot muncul
- [ ] Download screenshot → File terdownload
- [ ] Fullscreen mode → Screenshot fullscreen
- [ ] Remote control → Command berfungsi

---

## 🎯 Quick Start Commands

### **Start Semua Service:**

```powershell
# Terminal 1 - Backend
cd D:\labmonitor-backend
npm run dev

# Terminal 2 - Frontend
cd D:\labmonitor-frontend
npm run dev

# Terminal 3 - Agent (di PC-13, sebagai Administrator)
cd C:\labmonitor-agent
npm start
```

### **Stop Semua Service:**

```powershell
# Di setiap terminal, tekan Ctrl+C
```

### **Restart Service:**

```powershell
# Backend
cd D:\labmonitor-backend
# Ctrl+C
npm run dev

# Frontend
cd D:\labmonitor-frontend
# Ctrl+C
npm run dev

# Agent (di PC-13)
cd C:\labmonitor-agent
# Ctrl+C
npm start
```

---

## 🔍 Troubleshooting

### **Problem: Backend Error**

**Error:** `Cannot find module './routes/computers'`

**Solusi:**
```powershell
# Pastikan folder routes ada
cd D:\labmonitor-backend\src
dir routes

# Jika tidak ada, buat folder dan file:
mkdir routes
# Copy file routes dari project ini
```

### **Problem: Agent Error**

**Error:** `Cannot find module './monitors/system'`

**Solusi:**
```cmd
# Pastikan folder monitors ada
cd C:\labmonitor-agent\src
dir monitors

# Jika tidak ada, buat folder dan file:
mkdir monitors
# Copy file monitors dari project ini
```

### **Problem: Screenshot Tidak Muncul**

**Cek 1: Backend Log**
```
Harus ada: 📸 Screenshot request received for: PC-13
Harus ada: 📸 Screenshot captured from: PC-13
```

**Cek 2: Agent Log**
```
Harus ada: 📸 Screenshot request received
Harus ada: ✅ Screenshot sent to backend
```

**Cek 3: Browser Console**
```
Harus ada: 📸 Requesting screenshot from: PC-13
Harus ada: 📸 Screenshot captured: PC-13
```

### **Problem: Socket Tidak Connected**

**Solusi:**
```powershell
# Restart semua service
# Backend
cd D:\labmonitor-backend
# Ctrl+C
npm run dev

# Frontend
cd D:\labmonitor-frontend
# Ctrl+C
npm run dev

# Agent
cd C:\labmonitor-agent
# Ctrl+C
npm start
```

---

## 📖 Dokumentasi Lengkap

Baca file-file berikut untuk detail:

1. **`PANDUAN-SCREENSHOT-DASHBOARD.md`** - Panduan penggunaan screenshot
2. **`BACKEND-SCREENSHOT-INTEGRATION.md`** - Implementasi backend
3. **`FIX-REMOTE-CONTROL.md`** - Fix remote control
4. **`agent/TROUBLESHOOTING-REMOTE.md`** - Troubleshooting agent

---

## ✅ Summary

**File yang Perlu Di-copy:**

1. ✅ `agent/backend-server-complete.js` → `D:\labmonitor-backend\src\server.js`
2. ✅ `agent/agent-complete.js` → `C:\labmonitor-agent\src\agent.js`

**Langkah:**

1. ✅ Copy backend server file
2. ✅ Restart backend
3. ✅ Copy agent file ke PC-13
4. ✅ Restart agent
5. ✅ Test screenshot di dashboard

**Expected Result:**

- ✅ Klik "Lihat Layar" → Screenshot muncul dalam 2-5 detik
- ✅ Download screenshot berfungsi
- ✅ Fullscreen mode berfungsi
- ✅ Remote control berfungsi

**Status: ✅ READY TO USE** 🎉

---

## 🎊 SELESAI!

Semua file sudah lengkap dan siap di-copy paste. Tinggal:

1. Copy 2 file (backend & agent)
2. Restart service
3. Test fitur screenshot

**Selamat menggunakan LabMonitor!** 🚀
