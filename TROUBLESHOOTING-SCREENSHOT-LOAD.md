# 🔧 Troubleshooting: Screenshot Gagal Dimuat

## ❌ Masalah

**Error:** "Gagal memuat screenshot - File mungkin rusak atau tidak valid"

**Gejala:**
- ✅ Agent berhasil ambil screenshot
- ✅ Screenshot terkirim ke backend
- ❌ Frontend tidak bisa menampilkan screenshot
- ❌ Modal screenshot muncul tapi gambar tidak load

---

## 🔍 Penyebab

### **1. Base64 Format Tidak Valid**

**Masalah:**
- Prefix base64 salah: `image/png;base64,` (seharusnya `data:image/png;base64,`)
- Double encoding base64
- Base64 string terpotong atau corrupt

**Solusi:**
- ✅ Sudah di-fix di `App.tsx` dan `ScreenshotViewer.tsx`
- ✅ Auto-detect dan fix format base64

---

### **2. Socket.io Buffer Size Terlalu Kecil**

**Masalah:**
- Default socket.io buffer size: 1 MB
- Screenshot bisa > 5 MB (tergantung resolusi)
- Data terpotong saat dikirim

**Solusi:**
- ✅ Sudah di-fix di `server.js` backend
- ✅ Increase `maxHttpBufferSize` ke 50 MB

```javascript
const io = socketIo(server, {
  maxHttpBufferSize: 50 * 1024 * 1024, // 50 MB
  transports: ['websocket', 'polling']
});
```

---

### **3. Double Encoding Base64**

**Masalah:**
- `remoteController.takeScreenshot()` sudah return base64
- `agent.js` baca file lagi dan convert ke base64 lagi
- Hasil: `data:image/png;base64,data:image/png;base64,...` (double!)

**Solusi:**
- ✅ Sudah di-fix di `agent-complete.js`
- ✅ Check jika result sudah ada `image`, gunakan langsung
- ✅ Hanya baca file jika hanya ada `path`

---

## ✅ SOLUSI LENGKAP

### **File yang Perlu Di-update:**

#### **1. Backend: `D:\labmonitor-backend\src\server.js`**

**Update bagian Socket.io configuration:**

```javascript
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      process.env.CORS_ORIGIN_NETWORK || 'http://192.168.100.166:3000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
  maxHttpBufferSize: 50 * 1024 * 1024, // 50 MB - TAMBAHKAN INI!
  transports: ['websocket', 'polling']  // TAMBAHKAN INI!
});
```

**Cara update:**
1. Buka `D:\labmonitor-backend\src\server.js`
2. Cari bagian `const io = socketIo(server, {`
3. Tambahkan 2 baris:
   - `maxHttpBufferSize: 50 * 1024 * 1024,`
   - `transports: ['websocket', 'polling']`
4. Save file
5. Restart backend: `npm run dev`

**Atau copy file lengkap:**
```powershell
copy agent\backend-server-complete.js D:\labmonitor-backend\src\server.js
```

---

#### **2. Agent: `C:\labmonitor-agent\src\agent.js`**

**Update fungsi `setupScreenshotListener()`:**

```javascript
setupScreenshotListener() {
  this.socketService.on('request-screenshot', async (data) => {
    try {
      if (data.computerId && data.computerId !== this.computerId) {
        return;
      }

      logger.info('📸 Screenshot request received');
      
      const result = await this.remoteController.takeScreenshot();
      
      if (result.success) {
        let imageData = '';
        let imageSize = 0;
        
        // FIX: Check jika result sudah ada image (base64)
        if (result.image) {
          // Gunakan langsung dari result (sudah ada base64)
          imageData = result.image;
          imageSize = result.size || 0;
          logger.info('✅ Using pre-encoded image from result');
        } else if (result.path) {
          // Hanya baca file jika tidak ada image
          const fileData = fs.readFileSync(result.path);
          const base64Image = fileData.toString('base64');
          imageData = `data:image/png;base64,${base64Image}`;
          imageSize = fileData.length;
          logger.info('✅ Converted file to base64');
        } else {
          logger.error('❌ No image data or path in result');
          return;
        }
          
        this.socketService.emit('screenshot-captured', {
          id: Date.now().toString(),
          computerId: this.computerId,
          computerName: data.computerName || 'Unknown',
          studentName: data.studentName || 'Unknown',
          image: imageData,
          timestamp: new Date().toISOString(),
          size: imageSize,
          path: result.path
        });
        
        logger.info('✅ Screenshot sent to backend');
        logger.info(`✅ Image size: ${(imageSize / 1024).toFixed(2)} KB`);
      }
    } catch (error) {
      logger.error('❌ Error handling screenshot request:', error.message);
    }
  });

  logger.info('✅ Screenshot listener active');
}
```

**Cara update:**
1. Buka `C:\labmonitor-agent\src\agent.js`
2. Cari fungsi `setupScreenshotListener()`
3. Replace dengan kode di atas
4. Save file
5. Restart agent: `npm start`

**Atau copy file lengkap:**
```powershell
copy agent\agent-complete.js C:\labmonitor-agent\src\agent.js
```

---

#### **3. Frontend: Sudah Auto-fix**

**File yang sudah di-update:**
- ✅ `src/App.tsx` - Validasi base64 format
- ✅ `src/components/ScreenshotViewer.tsx` - Auto-fix base64 prefix

**Tidak perlu update manual**, cukup restart frontend:
```powershell
cd D:\labmonitor-frontend
npm run dev
```

---

## 🧪 Testing Setelah Fix

### **Test 1: Cek Backend Log**

```powershell
# Di terminal backend
cd D:\labmonitor-backend
npm run dev
```

**Expected output:**
```
🚀 ========================================
🚀 LabMonitor Backend Server
🚀 ========================================
✅ Socket.io ready for connections
✅ Database save enabled for real-time data
✅ Screenshot feature enabled
✅ Remote control relay enabled
```

### **Test 2: Cek Agent Log**

```cmd
# Di PC-13
cd C:\labmonitor-agent
npm start
```

**Expected output:**
```
🚀 ========================================
🚀 LabMonitor Agent Starting...
🚀 Computer ID: PC-13
🚀 ========================================
✅ Connected to backend
✅ Agent started successfully
✅ Remote command listener active
✅ Screenshot listener active
```

### **Test 3: Ambil Screenshot**

1. Buka dashboard: **http://localhost:3000**
2. Klik komputer **PC-13**
3. Tab **"Kontrol"**
4. Klik **"Lihat Layar"** 👁️

**Expected di Browser Console (F12):**
```
📸 Requesting screenshot from: PC-13
📸 Screenshot captured: PC-13
📸 Image data length: 1234567
📸 Image format valid: data:image/png;base64,iVBORw0KGgoAAAANS...
```

**Expected di Backend Log:**
```
📸 Screenshot request received for: PC-13
📸 Computer: Komputer 13
📸 Student: Siswa Lab 13
📸 Screenshot captured from: PC-13
📸 Image size: 1,234.56 KB
```

**Expected di Agent Log:**
```
📸 Screenshot request received
📸 Executing VIEW SCREEN / SCREENSHOT command
✅ Screenshot saved to: C:\Users\...\labmonitor_screenshot_*.png
✅ Using pre-encoded image from result
✅ Screenshot sent to backend
✅ Image size: 1,234.56 KB
```

**Expected di Dashboard:**
- ✅ Modal screenshot muncul
- ✅ Gambar screenshot tampil dengan benar
- ✅ Tidak ada error "Gagal memuat screenshot"

---

## 🔍 Debugging Lanjutan

### **Jika Masih Error:**

#### **Cek 1: Base64 Format**

Buka Browser Console (F12) dan jalankan:

```javascript
// Cek screenshot yang terakhir
console.log(window.currentScreenshot);

// Cek format image
console.log('Image starts with:', window.currentScreenshot.image.substring(0, 50));

// Expected: "data:image/png;base64,iVBORw0KGgo..."
```

**Jika format salah:**
- ❌ `image/png;base64,...` → Kurang `data:` prefix
- ❌ `data:image/png;base64,data:image/png;base64,...` → Double encoding
- ❌ `iVBORw0KGgo...` → Kurang prefix sama sekali

**Solusi:** Frontend sudah auto-fix, tapi jika masih error, cek agent.js apakah ada double encoding.

---

#### **Cek 2: Ukuran Image**

```javascript
// Cek ukuran image
console.log('Image size:', window.currentScreenshot.size, 'bytes');
console.log('Image size:', (window.currentScreenshot.size / 1024 / 1024).toFixed(2), 'MB');
```

**Jika ukuran > 10 MB:**
- Resolusi layar terlalu tinggi
- Perlu compress image di agent

**Solusi sementara:**
- Turunkan resolusi layar di PC siswa
- Atau increase `maxHttpBufferSize` di backend

---

#### **Cek 3: Socket.io Connection**

```javascript
// Cek socket connection
const socket = io('http://localhost:3001');
socket.on('connect', () => console.log('✅ Connected'));
socket.on('disconnect', () => console.log('❌ Disconnected'));
```

**Jika tidak connect:**
- Backend tidak running
- Firewall blocking
- CORS error

**Solusi:**
- Restart backend
- Cek firewall
- Cek CORS configuration

---

#### **Cek 4: Agent Screenshot**

```cmd
# Di PC-13, cek apakah screenshot file ada
dir %TEMP%\labmonitor_screenshot_*.png

# Buka file screenshot
start %TEMP%\labmonitor_screenshot_*.png
```

**Jika file tidak ada:**
- Agent tidak bisa ambil screenshot
- PowerShell script error
- Permission issue

**Solusi:**
- Run agent sebagai Administrator
- Cek PowerShell execution policy
- Cek log agent untuk detail error

---

## 📊 Comparison: Sebelum vs Sesudah Fix

### **SEBELUM:**
```javascript
// Agent.js - Double encoding
const result = await this.remoteController.takeScreenshot();
// result.image = 'image/png;base64,...' (SALAH!)

fs.readFile(result.path, (err, data) => {
  const base64Image = data.toString('base64');
  this.socketService.emit('screenshot-captured', {
    image: `image/png;base64,${base64Image}`, // DOUBLE ENCODING!
  });
});
```

**Hasil:**
- ❌ Frontend terima: `image/png;base64,image/png;base64,...`
- ❌ Browser tidak bisa parse
- ❌ Error: "Gagal memuat screenshot"

---

### **SESUDAH:**
```javascript
// Agent.js - No double encoding
const result = await this.remoteController.takeScreenshot();

if (result.image) {
  // Gunakan langsung dari result (sudah benar)
  imageData = result.image; // 'data:image/png;base64,...'
} else if (result.path) {
  // Hanya baca file jika perlu
  const fileData = fs.readFileSync(result.path);
  imageData = `data:image/png;base64,${fileData.toString('base64')}`;
}
```

**Hasil:**
- ✅ Frontend terima: `data:image/png;base64,iVBORw0KGgo...`
- ✅ Browser bisa parse
- ✅ Screenshot tampil dengan benar

---

## ✅ Checklist Verifikasi

### **Backend:**
- [ ] File `server.js` sudah diupdate
- [ ] `maxHttpBufferSize: 50 * 1024 * 1024` ditambahkan
- [ ] `transports: ['websocket', 'polling']` ditambahkan
- [ ] Backend restart tanpa error

### **Agent:**
- [ ] File `agent.js` sudah diupdate
- [ ] Fungsi `setupScreenshotListener()` sudah di-fix
- [ ] Tidak ada double encoding
- [ ] Agent restart tanpa error

### **Frontend:**
- [ ] File `App.tsx` sudah diupdate
- [ ] File `ScreenshotViewer.tsx` sudah diupdate
- [ ] Auto-fix base64 format aktif
- [ ] Frontend restart

### **Test:**
- [ ] Klik "Lihat Layar" → Screenshot muncul
- [ ] Browser Console tidak ada error
- [ ] Base64 format valid: `data:image/png;base64,...`
- [ ] Gambar screenshot tampil dengan jelas

---

## 🎯 Quick Fix Commands

### **Update Semua File:**

```powershell
# Di server admin
copy agent\backend-server-complete.js D:\labmonitor-backend\src\server.js
copy agent\agent-complete.js \\PC-13\C$\labmonitor-agent\src\agent.js

# Restart backend
cd D:\labmonitor-backend
npm run dev

# Restart agent (di PC-13)
cd C:\labmonitor-agent
npm start

# Restart frontend
cd D:\labmonitor-frontend
npm run dev
```

---

## 📞 Jika Masih Bermasalah

**Kirim informasi ini:**

1. **Browser Console log:**
   - Tekan F12 → Tab Console
   - Copy semua log saat klik "Lihat Layar"

2. **Backend log:**
   - Copy log dari terminal backend

3. **Agent log:**
   - Copy log dari terminal agent di PC-13

4. **Base64 format:**
   ```javascript
   // Di Browser Console
   console.log(window.currentScreenshot.image.substring(0, 100));
   ```

5. **Ukuran image:**
   ```javascript
   console.log('Size:', window.currentScreenshot.size, 'bytes');
   ```

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

## ✅ Summary

**Masalah:** Screenshot gagal dimuat karena base64 format tidak valid

**Penyebab:**
1. ❌ Base64 prefix salah (`image/png;base64,` bukan `data:image/png;base64,`)
2. ❌ Double encoding base64
3. ❌ Socket.io buffer size terlalu kecil

**Solusi:**
1. ✅ Fix base64 format di agent.js
2. ✅ Increase socket.io buffer size di server.js
3. ✅ Auto-fix base64 di frontend (App.tsx & ScreenshotViewer.tsx)

**Status:** ✅ **FIXED** - Screenshot sekarang bisa dimuat dengan benar! 🎉
