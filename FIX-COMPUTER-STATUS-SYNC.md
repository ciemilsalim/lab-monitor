# 🔧 Fix Status Komputer Tidak Sinkron

## 📋 Masalah yang Diperbaiki

**Sebelum:**
- ❌ Status komputer tidak ter-update secara real-time
- ❌ PC yang terhubung terlihat offline
- ❌ Data CPU/RAM tidak sinkron dengan database
- ❌ Perlu manual refresh untuk lihat status terbaru

**Sesudah:**
- ✅ Status komputer ter-update secara real-time via Socket.io
- ✅ Data lengkap (status, CPU, RAM, student info) ter-sync otomatis
- ✅ Auto-refresh setiap 10 detik untuk memastikan data selalu terbaru
- ✅ Full computer data di-broadcast dari backend

---

## 🎯 Perubahan yang Dilakukan

### **1. Backend (server.js) - v1.1.0**

**Perubahan:**
- ✅ Tambah fungsi `getFullComputerData()` untuk ambil data lengkap dari database
- ✅ Broadcast FULL computer data saat agent connect/update (bukan hanya status)
- ✅ Tambah endpoint `request-computer-list` untuk sync data
- ✅ Emit data lengkap: computerId, name, ipAddress, status, cpu, ram, studentName, dll

**Data yang di-broadcast:**
```javascript
{
  computerId: "PC-13",
  name: "Komputer 13",
  ipAddress: "192.168.100.113",
  macAddress: "AA:BB:CC:DD:EE:13",
  status: "online",
  studentName: "Siswa Lab 13",
  studentId: "LAB13",
  studentClass: "LAB",
  cpu: 45.5,
  ram: 62.3,
  networkSpeed: 85.2,
  os: "Windows 11 Pro",
  currentApp: "Chrome",
  currentUrl: "https://github.com",
  lastHeartbeat: "2026-10-08T12:00:00.000Z",
  timestamp: "2026-10-08T12:00:00.000Z"
}
```

### **2. Frontend (App.tsx)**

**Perubahan:**
- ✅ Update handler `computer-updated` untuk terima data lengkap
- ✅ Tambah listener `computer-list` untuk sync data
- ✅ Auto-refresh setiap 10 detik via `requestComputerList()`
- ✅ Update semua field komputer (status, cpu, ram, studentName, dll)
- ✅ Tambah logging untuk debugging

### **3. Socket Service (socket.ts)**

**Perubahan:**
- ✅ Tambah method `onComputerList()` untuk listen computer list
- ✅ Tambah method `requestComputerList()` untuk request sync
- ✅ Tambah generic `on()` method untuk custom events

---

## 🚀 Cara Update (Step-by-Step)

### **LANGKAH 1: Update Backend**

**File:** `D:\labmonitor-backend\src\server.js`

**Cara Update:**

**Option A: Copy File Lengkap (RECOMMENDED)**
```powershell
# Di server admin
copy agent\backend-server-v1.1.js D:\labmonitor-backend\src\server.js
```

**Option B: Manual Edit**
1. Buka `D:\labmonitor-backend\src\server.js`
2. Cari bagian `socket.on('agent-connect', ...)`
3. Replace dengan kode baru dari `backend-server-v1.1.js`
4. Cari bagian `socket.on('computer-update', ...)`
5. Replace dengan kode baru
6. Tambah fungsi `getFullComputerData()` di atas `io.on('connection', ...)`
7. Tambah handler `socket.on('request-computer-list', ...)`

**Restart Backend:**
```powershell
cd D:\labmonitor-backend
npm run dev
```

**Expected Output:**
```
🚀 ========================================
🚀 LabMonitor Backend Server v1.1.0
🚀 ========================================
✅ Socket.io ready for connections
✅ Full computer data broadcast enabled
✅ Real-time sync enabled
```

---

### **LANGKAH 2: Update Frontend**

**Files:**
- `D:\labmonitor-frontend\src\App.tsx`
- `D:\labmonitor-frontend\src\services\socket.ts`

**Cara Update:**

**Option A: Copy File Lengkap (RECOMMENDED)**
```powershell
# Di server admin
copy src\App.tsx D:\labmonitor-frontend\src\App.tsx
copy src\services\socket.ts D:\labmonitor-frontend\src\services\socket.ts
```

**Option B: Manual Edit**

**Edit App.tsx:**
1. Cari bagian `socketService.onComputerUpdated(...)`
2. Replace dengan kode baru (handle full data)
3. Tambah listener `socketService.onComputerList(...)`
4. Tambah `syncInterval` untuk auto-refresh setiap 10 detik
5. Update cleanup function untuk clear `syncInterval`

**Edit socket.ts:**
1. Tambah method `onComputerList()`
2. Tambah method `requestComputerList()`
3. Tambah generic `on()` method

**Restart Frontend:**
```powershell
cd D:\labmonitor-frontend
npm run dev
```

---

### **LANGKAH 3: Test Sinkronisasi**

**Test 1: Cek Real-time Update**

1. Buka dashboard: **http://localhost:3000**
2. Buka Browser Console (F12)
3. Lihat log:
   ```
   📋 Received full computer list: X computers
   📡 Real-time computer update: {...}
   ✅ Computer updated in state: {...}
   ```

**Test 2: Cek Status Komputer**

1. Di PC siswa, pastikan agent running
2. Di dashboard, cek status komputer
3. Status harus: **Online** (hijau)
4. CPU/RAM harus ter-update setiap 5 detik

**Test 3: Cek Auto-refresh**

1. Biarkan dashboard terbuka
2. Tunggu 10 detik
3. Cek Browser Console:
   ```
   📋 Received full computer list: X computers
   ```
4. Data harus ter-refresh otomatis

---

## 🔍 Troubleshooting

### **Problem 1: Status Masih Tidak Update**

**Cek 1: Backend Log**
```
# Di terminal backend
Harus ada log:
🤖 Agent connected: PC-13
✅ Agent status updated in database
✅ Full computer data broadcasted: PC-13
```

**Cek 2: Frontend Console**
```
# Di Browser Console (F12)
Harus ada log:
📡 Real-time computer update: {...}
✅ Computer updated in state: {...}
```

**Cek 3: Database**
```sql
-- Di phpMyAdmin
SELECT computer_id, status, cpu_usage, ram_usage, last_heartbeat 
FROM computers 
WHERE computer_id = 'PC-13';

-- Status harus: 'online'
-- last_heartbeat harus: recent timestamp
```

---

### **Problem 2: Data Tidak Sinkron**

**Solusi:**
```javascript
// Di Browser Console, request manual sync
socketService.requestComputerList();
```

**Expected:**
```
📋 Received full computer list: X computers
```

---

### **Problem 3: Auto-refresh Tidak Berjalan**

**Cek:**
```javascript
// Di Browser Console
console.log(socketService.isConnected());
// Harus: true
```

**Solusi:**
- Restart frontend
- Cek socket connection
- Cek backend running

---

## 📊 Alur Data Baru

```
┌─────────────────────────────────────────────────────────┐
│ 1. Agent connect ke backend                            │
│    emit: 'agent-connect' { computerId: 'PC-13' }      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Backend update database                             │
│    UPDATE computers SET status='online' ...            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Backend get FULL computer data dari database        │
│    SELECT c.*, s.name, s.student_id ...                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Backend broadcast FULL data ke semua frontend       │
│    emit: 'computer-updated' { full computer data }     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Frontend terima & update state                      │
│    setComputers(prev => update computer)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. UI ter-update secara real-time                      │
│    Status, CPU, RAM, student info semua sinkron        │
└─────────────────────────────────────────────────────────┘
```

**Auto-refresh (setiap 10 detik):**
```
Frontend → emit 'request-computer-list' → Backend
Backend → query database → emit 'computer-list' → Frontend
Frontend → update state dengan data terbaru
```

---

## ✅ Checklist Verifikasi

### **Backend:**
- [ ] File `server.js` sudah diupdate ke v1.1.0
- [ ] Fungsi `getFullComputerData()` ada
- [ ] Handler `request-computer-list` ada
- [ ] Backend restart tanpa error
- [ ] Log menunjukkan "Full computer data broadcast enabled"

### **Frontend:**
- [ ] File `App.tsx` sudah diupdate
- [ ] File `socket.ts` sudah diupdate
- [ ] Method `onComputerList()` ada
- [ ] Method `requestComputerList()` ada
- [ ] `syncInterval` untuk auto-refresh ada
- [ ] Frontend restart tanpa error

### **Testing:**
- [ ] Agent connect → status update ke 'online'
- [ ] Browser Console menunjukkan log update
- [ ] Status komputer ter-update real-time
- [ ] CPU/RAM ter-update setiap 5 detik
- [ ] Auto-refresh berjalan setiap 10 detik
- [ ] Data sinkron antara database dan UI

---

## 🎯 Expected Result

**Setelah update:**

✅ **Real-time Status:**
- PC terhubung → Status: **Online** (hijau)
- PC tidak terhubung → Status: **Offline** (merah)
- PC idle → Status: **Idle** (kuning)
- PC locked → Status: **Locked** (merah)

✅ **Real-time Metrics:**
- CPU usage ter-update setiap 5 detik
- RAM usage ter-update setiap 5 detik
- Network speed ter-update setiap 5 detik
- Current app & URL ter-update

✅ **Auto-sync:**
- Data ter-sync otomatis setiap 10 detik
- Tidak perlu manual refresh
- Data selalu terbaru

✅ **Full Data:**
- Student name & ID ter-update
- Computer name & IP ter-update
- OS info ter-update
- Last heartbeat ter-update

---

## 📞 Support

**Dokumentasi:**
- `agent/backend-server-v1.1.js` - Backend lengkap
- `src/App.tsx` - Frontend lengkap
- `src/services/socket.ts` - Socket service lengkap

**Log Files:**
- Backend: `D:\labmonitor-backend\logs\server.log`
- Frontend: Browser Console (F12)
- Agent: `C:\labmonitor-agent\logs\agent.log`

---

**Status:** ✅ **READY TO UPDATE** 🎉

Update backend dan frontend dengan file yang sudah disediakan, lalu test sinkronisasi status komputer. Data akan ter-update secara real-time dan auto-refresh setiap 10 detik.
