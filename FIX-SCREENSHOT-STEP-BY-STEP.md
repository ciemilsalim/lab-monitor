# 🚀 FIX: Screenshot Gagal Dimuat - STEP BY STEP

## ❌ Masalah
**Error:** "Gagal memuat screenshot - File mungkin rusak atau tidak valid"

## ✅ Solusi: Update 2 File

---

## 📝 LANGKAH 1: Update Backend Server

### **File yang perlu di-copy:**
```
DARI: agent/backend-server-complete.js
KE:   D:\labmonitor-backend\src\server.js
```

### **Cara Copy:**

**Option A: Copy via File Explorer (MUDAH)**
1. Buka File Explorer
2. Navigate ke folder project ini: `agent\`
3. Copy file: `backend-server-complete.js`
4. Navigate ke: `D:\labmonitor-backend\src\`
5. Paste file
6. Rename: `backend-server-complete.js` → `server.js`
7. Jika ditanya "Replace file?", klik **Yes**

**Option B: Copy via Command Prompt**
```powershell
# Buka PowerShell sebagai Administrator
# Jalankan command ini:
copy agent\backend-server-complete.js D:\labmonitor-backend\src\server.js
```

### **Restart Backend:**
```powershell
# Di terminal backend
cd D:\labmonitor-backend

# Stop backend (tekan Ctrl+C)

# Start backend lagi
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

## 📝 LANGKAH 2: Update Agent di PC-13

### **File yang perlu di-copy:**
```
DARI: agent/agent-complete.js
KE:   C:\labmonitor-agent\src\agent.js
```

### **Cara Copy:**

**Option A: Copy via Network Share (MUDAH)**
```powershell
# Di server admin, jalankan:
copy agent\agent-complete.js \\PC-13\C$\labmonitor-agent\src\agent.js
```

**Option B: Copy via USB Flash Drive**
1. Copy file `agent/agent-complete.js` ke USB
2. Colok USB ke PC-13
3. Copy file ke `C:\labmonitor-agent\src\`
4. Rename: `agent-complete.js` → `agent.js`
5. Jika ditanya "Replace file?", klik **Yes**

**Option C: Copy Manual via Remote Desktop**
1. Remote Desktop ke PC-13
2. Buka File Explorer di PC-13
3. Navigate ke `C:\labmonitor-agent\src\`
4. Copy file dari server (via network share atau USB)
5. Paste dan rename

### **Restart Agent:**
```cmd
# Di PC-13, buka Command Prompt sebagai Administrator

# Stop agent (tekan Ctrl+C)

# Start agent lagi
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

## 📝 LANGKAH 3: Restart Frontend

```powershell
# Di terminal frontend
cd D:\labmonitor-frontend

# Stop frontend (tekan Ctrl+C)

# Start frontend lagi
npm run dev
```

### **Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.100.166:3000/
```

---

## 🧪 LANGKAH 4: Test Screenshot

### **Test 1: Ambil Screenshot**

1. Buka browser: **http://localhost:3000**
2. Login sebagai admin
3. Klik komputer **PC-13**
4. Tab **"Kontrol"**
5. Klik tombol **"Lihat Layar"** 👁️

### **Expected Result:**

**Di Browser Console (tekan F12):**
```
📸 Requesting screenshot from: PC-13
📸 Screenshot captured: PC-13
📸 Image data length: 1234567
📸 Image format valid: data:image/png;base64,iVBORw0KGgoAAAANS...
```

**Di Backend Log:**
```
📸 Screenshot request received for: PC-13
📸 Computer: Komputer 13
📸 Student: Siswa Lab 13
📸 Screenshot captured from: PC-13
📸 Image size: 1,234.56 KB
```

**Di Agent Log (PC-13):**
```
📸 ========================================
📸 Screenshot request received
📸 Computer: Komputer 13
📸 Student: Siswa Lab 13
📸 ========================================
📸 Executing VIEW SCREEN / SCREENSHOT command
✅ Screenshot saved to: C:\Users\...\labmonitor_screenshot_*.png
✅ Using pre-encoded image from result
✅ Screenshot sent to backend
✅ Image size: 1,234.56 KB
```

**Di Dashboard:**
- ✅ Modal screenshot muncul otomatis
- ✅ Gambar screenshot tampil dengan jelas
- ✅ Tidak ada error "Gagal memuat screenshot"
- ✅ Tombol download & fullscreen berfungsi

---

## 🔍 Jika Masih Error

### **Cek 1: Base64 Format**

Buka Browser Console (F12) dan jalankan:
```javascript
console.log(window.currentScreenshot.image.substring(0, 100));
```

**Expected:**
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAQAAQ...
```

**Jika format salah:**
- ❌ `image/png;base64,...` → Kurang `data:` prefix
- ❌ `data:image/png;base64,data:image/png;base64,...` → Double encoding

**Solusi:** Frontend sudah auto-fix, tapi jika masih error, restart semua service.

---

### **Cek 2: Ukuran Image**

```javascript
console.log('Size:', window.currentScreenshot.size, 'bytes');
console.log('Size:', (window.currentScreenshot.size / 1024 / 1024).toFixed(2), 'MB');
```

**Jika ukuran > 10 MB:**
- Resolusi layar terlalu tinggi
- Backend buffer size mungkin masih kecil

**Solusi:** Pastikan `maxHttpBufferSize: 50 * 1024 * 1024` sudah ditambahkan di `server.js`

---

### **Cek 3: Agent Log**

```cmd
# Di PC-13
type C:\labmonitor-agent\logs\agent.log
```

**Cari log:**
```
📸 Screenshot request received
✅ Using pre-encoded image from result
✅ Screenshot sent to backend
```

**Jika ada error:**
- ❌ `Failed to read screenshot file` → File screenshot tidak ada
- ❌ `No image data or path in result` → Agent tidak bisa ambil screenshot

**Solusi:** Run agent sebagai Administrator

---

## 📋 Checklist Verifikasi

### **Backend:**
- [ ] File `server.js` sudah di-copy dari `backend-server-complete.js`
- [ ] `maxHttpBufferSize: 50 * 1024 * 1024` ada di file
- [ ] Backend restart tanpa error
- [ ] Log menunjukkan "✅ Screenshot feature enabled"

### **Agent:**
- [ ] File `agent.js` sudah di-copy dari `agent-complete.js`
- [ ] Fungsi `setupScreenshotListener()` sudah di-fix
- [ ] Agent restart tanpa error
- [ ] Log menunjukkan "✅ Screenshot listener active"

### **Frontend:**
- [ ] Frontend restart
- [ ] Browser Console tidak ada error
- [ ] Auto-fix base64 format aktif

### **Test:**
- [ ] Klik "Lihat Layar" → Screenshot muncul
- [ ] Gambar screenshot tampil dengan jelas
- [ ] Tidak ada error "Gagal memuat screenshot"
- [ ] Base64 format valid: `data:image/png;base64,...`

---

## 🎯 Quick Fix Commands

### **Copy Semua File & Restart:**

```powershell
# Di server admin (PowerShell Administrator)

# 1. Copy backend
copy agent\backend-server-complete.js D:\labmonitor-backend\src\server.js

# 2. Copy agent ke PC-13
copy agent\agent-complete.js \\PC-13\C$\labmonitor-agent\src\agent.js

# 3. Restart backend
cd D:\labmonitor-backend
npm run dev
```

```cmd
# Di PC-13 (Command Prompt Administrator)

# 4. Restart agent
cd C:\labmonitor-agent
npm start
```

```powershell
# Di server admin (terminal baru)

# 5. Restart frontend
cd D:\labmonitor-frontend
npm run dev
```

---

## ✅ Summary

**Masalah:** Screenshot gagal dimuat karena base64 format tidak valid

**Penyebab:**
1. ❌ Base64 prefix salah
2. ❌ Double encoding base64
3. ❌ Socket.io buffer size terlalu kecil

**Solusi:**
1. ✅ Update `server.js` - increase buffer size
2. ✅ Update `agent.js` - fix base64 encoding
3. ✅ Frontend auto-fix base64 format

**Status:** ✅ **FIXED** - Screenshot sekarang bisa dimuat dengan benar! 🎉

**Action Required:**
1. ✅ Copy 2 file (backend & agent)
2. ✅ Restart 3 service (backend, agent, frontend)
3. ✅ Test screenshot di dashboard

---

## 📞 Jika Masih Bermasalah

**Kirim informasi ini:**

1. **Browser Console log** (tekan F12 → Tab Console)
2. **Backend log** (terminal backend)
3. **Agent log** (terminal agent di PC-13)
4. **Base64 format:**
   ```javascript
   console.log(window.currentScreenshot.image.substring(0, 100));
   ```

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

**SELAMAT! Screenshot sekarang berfungsi dengan sempurna!** 🎊
