# 📸 Backend Integration: Screenshot Feature

## 🎯 Overview

Fitur screenshot memungkinkan admin untuk melihat layar komputer siswa secara real-time dari dashboard.

## 🔄 Alur Data

```
1. Admin klik "Lihat Layar" di dashboard
   ↓
2. Frontend emit 'request-screenshot' via Socket.io
   ↓
3. Backend terima & broadcast 'request-screenshot' ke agent
   ↓
4. Agent terima request & ambil screenshot
   ↓
5. Agent convert screenshot ke base64
   ↓
6. Agent emit 'screenshot-captured' ke backend
   ↓
7. Backend broadcast 'screenshot-captured' ke frontend
   ↓
8. Frontend terima & tampilkan screenshot di modal
```

---

## 📝 Backend Implementation

### **File: `D:\labmonitor-backend\src\server.js`**

Tambahkan code berikut di dalam `io.on('connection', ...)`:

```javascript
// Handle screenshot request from frontend
socket.on('request-screenshot', (data) => {
  console.log('📸 Screenshot request received for:', data.computerId);
  
  // Broadcast to all agents (agent yang sesuai akan respond)
  io.emit('request-screenshot', {
    computerId: data.computerId,
    computerName: data.computerName,
    studentName: data.studentName,
    timestamp: data.timestamp
  });
});

// Handle screenshot captured from agent
socket.on('screenshot-captured', (data) => {
  console.log('📸 Screenshot captured from:', data.computerId);
  console.log('📸 Image size:', (data.size / 1024).toFixed(2), 'KB');
  
  // Broadcast to all connected frontends
  io.emit('screenshot-captured', {
    id: data.id || Date.now().toString(),
    computerId: data.computerId,
    computerName: data.computerName,
    studentName: data.studentName,
    image: data.image, // base64 encoded image
    timestamp: data.timestamp || new Date().toISOString(),
    size: data.size || 0,
    path: data.path
  });
});
```

---

## 🤖 Agent Implementation

### **File: `C:\labmonitor-agent\src\agent.js`**

Tambahkan handler untuk `request-screenshot`:

```javascript
// Listen for screenshot requests
this.socketService.on('request-screenshot', async (data) => {
  // Check if this request is for this computer
  if (data.computerId !== this.computerId) {
    return;
  }
  
  console.log('📸 Screenshot request received');
  
  try {
    // Take screenshot
    const result = await this.remoteController.takeScreenshot();
    
    if (result.success) {
      // Read screenshot file and convert to base64
      const fs = require('fs');
      const screenshotPath = result.path;
      
      fs.readFile(screenshotPath, (err, data) => {
        if (err) {
          console.error('❌ Failed to read screenshot:', err.message);
          return;
        }
        
        // Convert to base64
        const base64Image = data.toString('base64');
        
        // Emit screenshot to backend
        this.socketService.emit('screenshot-captured', {
          id: Date.now().toString(),
          computerId: this.computerId,
          computerName: data.computerName || 'Unknown',
          studentName: data.studentName || 'Unknown',
          image: `data:image/png;base64,${base64Image}`,
          timestamp: new Date().toISOString(),
          size: data.length,
          path: screenshotPath
        });
        
        console.log('✅ Screenshot sent to backend');
      });
    }
  } catch (error) {
    console.error('❌ Failed to take screenshot:', error.message);
  }
});
```

---

## 🎨 Frontend Implementation

### **File: `src/App.tsx`**

Sudah diimplementasi:
- ✅ State `currentScreenshot` untuk menyimpan screenshot yang sedang ditampilkan
- ✅ State `screenshots` untuk menyimpan history screenshot
- ✅ Socket listener `onScreenshotCaptured` untuk terima screenshot dari backend
- ✅ Render `ScreenshotViewer` component

### **File: `src/components/ScreenshotViewer.tsx`**

Component untuk menampilkan screenshot dengan fitur:
- ✅ Fullscreen mode
- ✅ Download screenshot
- ✅ Info komputer & siswa
- ✅ Timestamp & ukuran file
- ✅ Loading state
- ✅ Error handling

### **File: `src/components/ComputerDetail.tsx`**

Sudah diimplementasi:
- ✅ Tombol "Lihat Layar" dengan action 'view'
- ✅ Handler untuk emit `request-screenshot` ke backend

---

## 🧪 Testing

### **Test 1: Request Screenshot**

1. Buka dashboard admin
2. Klik komputer PC-13
3. Tab "Kontrol"
4. Klik tombol "Lihat Layar"

**Expected:**
- Browser Console: `📸 Requesting screenshot from: PC-13`
- Backend log: `📸 Screenshot request received for: PC-13`
- Agent log: `📸 Screenshot request received`
- Agent log: `✅ Screenshot sent to backend`
- Backend log: `📸 Screenshot captured from: PC-13`
- Frontend: Screenshot modal muncul dengan gambar

### **Test 2: Download Screenshot**

1. Di screenshot modal
2. Klik tombol download (icon download)

**Expected:**
- File PNG terdownload ke folder Downloads
- Nama file: `screenshot-PC-13-[timestamp].png`

### **Test 3: Fullscreen Mode**

1. Di screenshot modal
2. Klik tombol fullscreen (icon maximize)

**Expected:**
- Screenshot tampil fullscreen
- Klik lagi untuk minimize

---

## 📊 Data Structure

### **Screenshot Object:**

```typescript
interface Screenshot {
  id: string;              // Unique ID
  computerId: string;      // ID komputer (PC-13)
  computerName: string;    // Nama komputer (Komputer 13)
  studentName: string;     // Nama siswa
  image: string;           // Base64 encoded image
  timestamp: Date;         // Waktu screenshot diambil
  size: number;            // Ukuran file dalam bytes
  path?: string;           // Path file di PC siswa (optional)
}
```

### **Socket Events:**

1. **`request-screenshot`** (Frontend → Backend → Agent)
   ```javascript
   {
     computerId: 'PC-13',
     computerName: 'Komputer 13',
     studentName: 'Siswa Lab 13',
     timestamp: '2026-10-08T12:00:00.000Z'
   }
   ```

2. **`screenshot-captured`** (Agent → Backend → Frontend)
   ```javascript
   {
     id: '1791427760403',
     computerId: 'PC-13',
     computerName: 'Komputer 13',
     studentName: 'Siswa Lab 13',
     image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
     timestamp: '2026-10-08T12:00:00.000Z',
     size: 1234567,
     path: 'C:\\Users\\...\\labmonitor_screenshot_1791427760403.png'
   }
   ```

---

## 🔧 Troubleshooting

### **Problem: Screenshot tidak muncul**

**Cek 1: Backend log**
```
📸 Screenshot request received for: PC-13
📸 Screenshot captured from: PC-13
```

**Cek 2: Agent log**
```
📸 Screenshot request received
✅ Screenshot sent to backend
```

**Cek 3: Browser Console**
```
📸 Requesting screenshot from: PC-13
📸 Screenshot captured: PC-13
```

### **Problem: Screenshot gagal diambil**

**Penyebab:** Agent tidak running sebagai Administrator

**Solusi:**
```cmd
# Di PC-13
# Stop agent (Ctrl+C)
# Run sebagai Administrator
cd C:\labmonitor-agent
npm start
```

### **Problem: Screenshot terlalu besar**

**Penyebab:** Resolusi layar tinggi

**Solusi:** Compress image di agent sebelum kirim
```javascript
// TODO: Implement image compression
// Use sharp or jimp library
```

---

## 🚀 Future Enhancements

1. **Auto-refresh screenshot** setiap 5 detik (live view)
2. **Screenshot history** - lihat screenshot sebelumnya
3. **Screenshot gallery** per komputer
4. **Image compression** untuk mengurangi ukuran
5. **Screenshot annotation** - tambah catatan di screenshot
6. **Batch screenshot** - ambil screenshot semua komputer sekaligus
7. **Scheduled screenshot** - ambil screenshot otomatis setiap X menit

---

## ✅ Checklist Implementasi

### **Backend:**
- [ ] Tambah handler `request-screenshot` di server.js
- [ ] Tambah handler `screenshot-captured` di server.js
- [ ] Test broadcast ke agent
- [ ] Test broadcast ke frontend

### **Agent:**
- [ ] Tambah listener `request-screenshot` di agent.js
- [ ] Implementasi ambil screenshot
- [ ] Convert ke base64
- [ ] Emit `screenshot-captured` ke backend
- [ ] Test end-to-end

### **Frontend:**
- [x] Buat component ScreenshotViewer
- [x] Update App.tsx untuk handle screenshot state
- [x] Update ComputerDetail.tsx untuk request screenshot
- [x] Test UI/UX

---

## 📞 Support

Jika ada masalah, cek:
1. Backend log (terminal backend)
2. Agent log (terminal agent di PC siswa)
3. Browser Console (F12)
4. File `TROUBLESHOOTING-SCREENSHOT.md`

---

**Status: ✅ READY FOR TESTING** 🎉
