# 🔧 Fix Status Komputer Tidak Update Saat Agent Disconnect

## 📋 Masalah yang Diperbaiki

**Sebelum:**
- ❌ Status komputer tetap "online" meskipun agent sudah disconnect
- ❌ Database menyimpan status lama, tidak ter-update saat disconnect
- ❌ Frontend tidak tahu apakah agent masih connect atau tidak
- ❌ Tidak ada mekanisme heartbeat timeout detection

**Sesudah:**
- ✅ Status komputer ter-update otomatis saat agent disconnect
- ✅ Backend track koneksi agent secara real-time
- ✅ Heartbeat timeout detection (60 detik tanpa update = offline)
- ✅ Frontend terima event `computer-offline` langsung
- ✅ Tampilan "Connected/Disconnected" indicator
- ✅ Tampilan "Last seen" timestamp

---

## 🎯 Perubahan yang Dilakukan

### **1. Backend (server.js v1.2.0)**

#### **Fitur Baru:**

**✅ Connected Agents Tracking**
```javascript
// Map untuk track agent yang connect
const connectedAgents = new Map();
// Structure: { computerId -> { socketId, lastHeartbeat, connectedAt } }
```

**✅ Auto-Offline on Disconnect**
```javascript
socket.on('disconnect', async (reason) => {
  // Cari computer yang terhubung ke socket ini
  let disconnectedComputerId = null;
  
  connectedAgents.forEach((data, computerId) => {
    if (data.socketId === socket.id) {
      disconnectedComputerId = computerId;
    }
  });
  
  // Set offline jika ada agent yang disconnect
  if (disconnectedComputerId) {
    await setComputerOffline(disconnectedComputerId, `socket disconnect: ${reason}`);
  }
});
```

**✅ Heartbeat Timeout Detection**
```javascript
// Check setiap 15 detik
setInterval(async () => {
  const now = Date.now();
  const timeoutComputers = [];
  
  connectedAgents.forEach((data, computerId) => {
    const timeSinceLastHeartbeat = now - data.lastHeartbeat;
    
    if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) { // 60 detik
      timeoutComputers.push(computerId);
    }
  });
  
  // Set offline untuk yang timeout
  for (const computerId of timeoutComputers) {
    await setComputerOffline(computerId, 'heartbeat timeout');
  }
}, 15000);
```

**✅ Real-time Status di Database Query**
```javascript
async function getFullComputerData(computerId) {
  const isConnected = connectedAgents.has(computerId);
  
  return {
    ...computerData,
    status: isConnected ? 'online' : 'offline', // REAL-TIME!
    isConnected: isConnected, // NEW FLAG
  };
}
```

**✅ Reset All Computers on Startup**
```javascript
// Saat server start, reset semua status ke offline
async function resetAllComputersOffline() {
  await db.query('UPDATE computers SET status = ? WHERE status = ?', ['offline', 'online']);
}
```

**✅ New Endpoint: /api/connected-agents**
```javascript
app.get('/api/connected-agents', (req, res) => {
  const agents = [];
  connectedAgents.forEach((data, computerId) => {
    agents.push({
      computerId,
      socketId: data.socketId,
      connectedAt: data.connectedAt,
      lastHeartbeat: data.lastHeartbeat,
      isAlive: Date.now() - data.lastHeartbeat < HEARTBEAT_TIMEOUT
    });
  });
  res.json({ success: true, count: agents.length, agents });
});
```

---

### **2. Frontend (App.tsx)**

#### **Fitur Baru:**

**✅ Listen Event `computer-offline`**
```javascript
socketService.on('computer-offline', (data: any) => {
  console.log('🔴 Computer OFFLINE:', data.computerId, 'reason:', data.reason);
  
  setComputers(prev => {
    const computerIndex = prev.findIndex(c => c.id === data.computerId);
    
    if (computerIndex === -1) return prev;
    
    const newComputers = [...prev];
    newComputers[computerIndex] = {
      ...newComputers[computerIndex],
      status: 'offline',
      isConnected: false,
      cpu: 0,
      ram: 0,
      networkSpeed: 0,
      currentApp: '',
      currentUrl: '',
    };
    
    return newComputers;
  });
});
```

**✅ Track `isConnected` & `lastHeartbeat`**
```javascript
const updatedComputer = {
  ...prev[computerIndex],
  status: data.status,
  isConnected: data.isConnected, // NEW
  lastHeartbeat: data.lastHeartbeat, // NEW
  // ... other fields
};
```

---

### **3. ComputerGrid.tsx**

#### **Fitur Baru:**

**✅ Real-time Connection Indicator**
```jsx
{computer.status === 'online' && computer.isConnected !== undefined && (
  <div className={`mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
    computer.isConnected 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700'
  }`}>
    {computer.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
  </div>
)}
```

**✅ Last Heartbeat Display**
```jsx
{computer.lastHeartbeat && computer.status === 'online' && (
  <p className="text-xs text-gray-500 mt-1">
    Last seen: {new Date(computer.lastHeartbeat).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}
  </p>
)}
```

---

### **4. Types (types.ts)**

#### **Field Baru:**

```typescript
export interface Computer {
  // ... existing fields
  isConnected?: boolean; // Real-time connection status
  lastHeartbeat?: string | Date; // Last time agent sent data
}
```

---

## 🚀 Cara Update (Step-by-Step)

### **LANGKAH 1: Update Backend**

```powershell
# Di server admin
copy agent\backend-server-v1.2.js D:\labmonitor-backend\src\server.js

# Restart backend
cd D:\labmonitor-backend
npm run dev
```

**Expected Output:**
```
🚀 ========================================
🚀 LabMonitor Backend Server v1.2.0
🚀 ========================================
🔄 Resetting all computers to offline on startup...
✅ All computers reset to offline
✅ Real-time connection tracking ENABLED
✅ Auto-offline on disconnect ENABLED
✅ Heartbeat timeout detection ENABLED (60s)
```

---

### **LANGKAH 2: Update Frontend**

```powershell
# Di server admin
copy src\App.tsx D:\labmonitor-frontend\src\App.tsx
copy src\components\ComputerGrid.tsx D:\labmonitor-frontend\src\components\ComputerGrid.tsx
copy src\types.ts D:\labmonitor-frontend\src\types.ts

# Restart frontend
cd D:\labmonitor-frontend
npm run dev
```

---

### **LANGKAH 3: Test Real-time Status**

**Test 1: Agent Connect**
1. Start agent di PC siswa
2. Buka dashboard: **http://localhost:3000**
3. Cek Browser Console (F12):
   ```
   🤖 Agent connected: PC-13
   ✅ Agent tracked & status updated: PC-13
   📊 Total connected agents: 1
   ```
4. Di UI, komputer harus muncul:
   - Status: **Online** (hijau)
   - Badge: **🟢 Connected**
   - Last seen: **timestamp terbaru**

**Test 2: Agent Disconnect**
1. Stop agent di PC siswa (Ctrl+C)
2. Cek Browser Console:
   ```
   🔴 Computer OFFLINE: PC-13 reason: socket disconnect: transport close
   ✅ Computer marked offline in state: PC-13
   ```
3. Di UI, komputer harus berubah:
   - Status: **Offline** (abu-abu)
   - Badge: **🔴 Disconnected** (hilang)
   - CPU/RAM: **0%**

**Test 3: Heartbeat Timeout**
1. Biarkan agent running tapi pause process
2. Tunggu 60 detik
3. Cek Backend log:
   ```
   ⚠️ Heartbeat timeout: PC-13 (65s ago)
   🔴 Setting computer OFFLINE: PC-13 (reason: heartbeat timeout)
   ✅ Computer PC-13 marked as offline
   ```

**Test 4: Check Connected Agents API**
```bash
curl http://localhost:3001/api/connected-agents
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "agents": [
    {
      "computerId": "PC-13",
      "socketId": "abc123",
      "connectedAt": 1728384000000,
      "lastHeartbeat": 1728384055000,
      "isAlive": true
    }
  ]
}
```

---

## 📊 Alur Data Baru

### **Saat Agent Connect:**
```
1. Agent emit 'agent-connect' { computerId: 'PC-13' }
   ↓
2. Backend track di connectedAgents Map
   ↓
3. Backend update DB: status = 'online'
   ↓
4. Backend broadcast: 'computer-updated' { isConnected: true, ... }
   ↓
5. Frontend update state: status = 'online', isConnected = true
   ↓
6. UI tampilkan: 🟢 Connected + Last seen: HH:MM
```

### **Saat Agent Disconnect:**
```
1. Socket disconnect event triggered
   ↓
2. Backend cari computerId dari socket.id
   ↓
3. Backend remove dari connectedAgents Map
   ↓
4. Backend update DB: status = 'offline'
   ↓
5. Backend broadcast: 'computer-offline' { computerId: 'PC-13' }
   ↓
6. Frontend update state: status = 'offline', isConnected = false
   ↓
7. UI tampilkan: 🔴 Offline (abu-abu)
```

### **Heartbeat Timeout:**
```
1. Agent kirim 'computer-update' setiap 5 detik
   ↓
2. Backend update lastHeartbeat di connectedAgents Map
   ↓
3. Setiap 15 detik, backend check semua agents
   ↓
4. Jika (now - lastHeartbeat) > 60 detik → timeout
   ↓
5. Backend set offline & broadcast 'computer-offline'
   ↓
6. Frontend update UI ke offline
```

---

## 🔍 Troubleshooting

### **Problem 1: Status Masih Tidak Update ke Offline**

**Cek 1: Backend Log**
```
# Saat agent disconnect, harus ada:
❌ Client disconnected: [socket-id] (reason: transport close)
🔴 Setting computer OFFLINE: PC-13 (reason: socket disconnect: transport close)
✅ Computer PC-13 marked as offline
```

**Cek 2: Connected Agents API**
```bash
curl http://localhost:3001/api/connected-agents
```
- Jika agent masih ada di list → socket disconnect tidak ter-detect
- Jika agent tidak ada → backend sudah benar, cek frontend

**Cek 3: Frontend Console**
```
# Harus ada:
🔴 Computer OFFLINE: PC-13 reason: socket disconnect: transport close
✅ Computer marked offline in state: PC-13
```

---

### **Problem 2: Heartbeat Timeout Tidak Berjalan**

**Cek Backend Log:**
```
# Setiap 15 detik, harus ada check (jika ada timeout):
⚠️ Heartbeat timeout: PC-13 (65s ago)
```

**Jika tidak ada log:**
- Agent tidak kirim heartbeat → cek agent.js
- Backend tidak track heartbeat → cek `computer-update` handler

**Solusi:**
```javascript
// Di agent.js, pastikan ada:
this.socketService.emit('computer-update', {
  computerId: this.computerId,
  status: 'online',
  cpu: systemData.cpu,
  ram: systemData.ram,
  // ... other data
});
```

---

### **Problem 3: Semua Komputer Offline Setelah Restart Backend**

**Ini adalah EXPECTED BEHAVIOR!**

Saat backend restart:
1. Semua socket connections putus
2. Backend reset semua status ke offline
3. Agent harus reconnect manual

**Solusi:**
- Restart agent di semua PC siswa
- Atau agent auto-reconnect jika sudah setup auto-start

---

### **Problem 4: Status "Online" Tapi Agent Tidak Connect**

**Penyebab:**
- Database masih menyimpan status lama
- Backend belum restart setelah update

**Solusi:**
```powershell
# Restart backend
cd D:\labmonitor-backend
npm run dev

# Backend akan otomatis reset semua status ke offline
```

---

## 📋 Checklist Verifikasi

### **Backend:**
- [ ] File `server.js` sudah diupdate ke v1.2.0
- [ ] `connectedAgents` Map dideklarasikan
- [ ] `setComputerOffline()` function ada
- [ ] Heartbeat checker interval ada (15 detik)
- [ ] `disconnect` handler update status ke offline
- [ ] `resetAllComputersOffline()` dipanggil saat startup
- [ ] Endpoint `/api/connected-agents` ada
- [ ] Backend restart tanpa error

### **Frontend:**
- [ ] File `App.tsx` sudah diupdate
- [ ] File `ComputerGrid.tsx` sudah diupdate
- [ ] File `types.ts` sudah diupdate
- [ ] Listener `computer-offline` ada
- [ ] Field `isConnected` & `lastHeartbeat` di-transform
- [ ] UI tampilkan connection indicator
- [ ] UI tampilkan last heartbeat
- [ ] Frontend restart tanpa error

### **Testing:**
- [ ] Agent connect → status = online, isConnected = true
- [ ] Agent disconnect → status = offline, isConnected = false
- [ ] Heartbeat timeout → status = offline setelah 60 detik
- [ ] Backend restart → semua status reset ke offline
- [ ] Browser Console menunjukkan log yang benar
- [ ] UI update secara real-time

---

## 🎯 Expected Result

**Setelah update:**

✅ **Real-time Connection Tracking:**
- Agent connect → status langsung "online"
- Agent disconnect → status langsung "offline"
- Heartbeat timeout → status "offline" setelah 60 detik

✅ **Visual Indicators:**
- 🟢 **Connected** badge untuk komputer yang connect
- 🔴 **Disconnected** badge untuk komputer yang disconnect
- **Last seen** timestamp untuk tracking terakhir

✅ **Auto-recovery:**
- Backend restart → semua status reset ke offline
- Agent reconnect → status otomatis update ke online
- Network issue → heartbeat timeout detection

✅ **Debugging:**
- Backend log menunjukkan semua connection events
- Frontend console menunjukkan semua state updates
- API endpoint untuk check connected agents

---

## 📞 Support

**Dokumentasi:**
- `agent/backend-server-v1.2.js` - Backend lengkap
- `src/App.tsx` - Frontend lengkap
- `src/components/ComputerGrid.tsx` - UI component
- `src/types.ts` - Type definitions

**Log Files:**
- Backend: Terminal output
- Frontend: Browser Console (F12)
- Agent: `C:\labmonitor-agent\logs\agent.log`

**API Endpoints:**
- `GET /api/connected-agents` - List connected agents
- `GET /api/computers` - List all computers
- `GET /health` - Health check

---

**Status:** ✅ **READY TO UPDATE** 🎉

Update backend dan frontend dengan file yang sudah disediakan. Status komputer akan ter-update secara real-time berdasarkan koneksi socket agent, bukan hanya database.
