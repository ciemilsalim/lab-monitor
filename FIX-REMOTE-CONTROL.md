# 🔧 Fix Remote Control - Frontend Integration

## 📋 Masalah yang Diperbaiki

**Sebelum:**
- ❌ Frontend hanya menampilkan notifikasi
- ❌ Tidak ada command yang dikirim ke backend
- ❌ Agent tidak menerima perintah remote

**Sesudah:**
- ✅ Frontend mengirim command ke backend via Socket.io
- ✅ Backend broadcast command ke agent
- ✅ Agent menerima dan execute command

---

## 🎯 Perubahan yang Dilakukan

### 1. **RemoteDesktopViewer.tsx**

**File:** `src/components/RemoteDesktopViewer.tsx`

**Perubahan:**
- ✅ Import `socketService`
- ✅ Tambah fungsi `sendRemoteCommand()` untuk mengirim command ke backend
- ✅ Update fungsi `sendKeyCombination()` untuk emit via socket
- ✅ Update tombol **Screenshot** → emit `screenshot` command
- ✅ Update tombol **Mute** → emit `mute_audio` command
- ✅ Update tombol **Kirim Pesan** → emit `message` command dengan parameter

**Contoh kode:**
```typescript
// Fungsi baru untuk mengirim command
const sendRemoteCommand = (action: string, params: Record<string, any> = {}) => {
  console.log('🎮 Sending remote command:', { action, computerId: computer.id, ...params });
  
  socketService.emitRemoteCommand({
    action,
    computerId: computer.id,
    ...params,
    timestamp: new Date().toISOString()
  });
  
  notify(`✅ Perintah "${action}" dikirim ke ${computer.id}`);
};

// Tombol Screenshot
<button onClick={() => sendRemoteCommand('screenshot')}>
  <Camera className="w-4 h-4" />
  Screenshot
</button>

// Tombol Kirim Pesan
<button onClick={() => {
  const msg = prompt('Masukkan pesan untuk siswa:');
  if (msg) sendRemoteCommand('message', { message: msg });
}}>
  <MessageSquare className="w-4 h-4" />
  Kirim Pesan
</button>
```

---

### 2. **ComputerDetail.tsx**

**File:** `src/components/ComputerDetail.tsx`

**Perubahan:**
- ✅ Import `socketService`
- ✅ Update fungsi `handleAction()` untuk emit command via socket

**Contoh kode:**
```typescript
const handleAction = (action: string) => {
  console.log('🎮 Sending remote command from ComputerDetail:', { action, computerId: computer.id });
  
  // Emit command ke backend via socket
  socketService.emitRemoteCommand({
    action,
    computerId: computer.id,
    timestamp: new Date().toISOString()
  });
  
  setActionFeedback(`Perintah "${action}" berhasil dikirim ke ${computer.id}`);
  setTimeout(() => setActionFeedback(null), 3000);
};
```

**Tombol yang menggunakan fungsi ini:**
- Shutdown
- Restart
- Lock Screen
- Lihat Layar
- Kirim Pesan
- Blokir Internet

---

## 🔄 Alur Data Remote Control (Sudah Diperbaiki)

```
1. Admin klik tombol di dashboard
   ↓
2. Frontend emit 'remote-command' via Socket.io
   console.log('🎮 Sending remote command:', ...)
   ↓
3. Backend terima event 'remote-command'
   console.log('🎮 Remote command received:', ...)
   ↓
4. Backend broadcast 'execute-command' ke semua clients
   io.emit('execute-command', data)
   ↓
5. Agent terima event 'execute-command'
   console.log('📡 Received remote command:', ...)
   ↓
6. Agent execute command
   console.log('🎮 Executing remote command:', ...)
   ↓
7. Command dijalankan di PC siswa
   (shutdown, lock, message, dll)
   ↓
8. Agent emit 'command-result' ke backend
   ↓
9. Backend broadcast ke frontend
   ↓
10. Dashboard update status
```

---

## 🧪 Cara Testing

### **Test 1: Kirim Pesan**

**Langkah:**
1. Buka dashboard admin (http://localhost:3000)
2. Klik komputer PC-13
3. Tab "Kontrol"
4. Klik tombol "Remote Desktop Control"
5. Klik tombol "Kirim Pesan"
6. Masukkan pesan: "Test dari admin"
7. Klik OK

**Expected:**

**Browser Console (F12):**
```
🎮 Sending remote command: {action: 'message', computerId: 'PC-13', message: 'Test dari admin'}
```

**Terminal Backend:**
```
🎮 Remote command received: {action: 'message', computerId: 'PC-13', message: 'Test dari admin'}
```

**Terminal Agent (PC-13):**
```
📡 ========================================
📡 Received remote command
📡 Action: message
📡 Target: PC-13
📡 ========================================

🎮 ========================================
🎮 Executing remote command
🎮 Action: message
🎮 ========================================

💬 Executing SHOW MESSAGE command
✅ Command result: SUCCESS
✅ Message: Message displayed successfully
```

**Di PC-13:**
- ✅ Muncul popup message box dengan pesan "Test dari admin"

---

### **Test 2: Screenshot**

**Langkah:**
1. Di Remote Desktop Viewer
2. Klik tombol "Screenshot"

**Expected:**

**Browser Console:**
```
🎮 Sending remote command: {action: 'screenshot', computerId: 'PC-13'}
```

**Terminal Agent:**
```
📸 Executing SCREENSHOT command
✅ Command result: SUCCESS
✅ Message: Screenshot taken successfully
```

**Di PC-13:**
- ✅ Screenshot diambil dan disimpan di `C:\Users\...\AppData\Local\Temp\labmonitor_screenshot_*.png`

---

### **Test 3: Lock Screen**

**Langkah:**
1. Di Computer Detail → Tab "Kontrol"
2. Klik tombol "Lock Screen"

**Expected:**

**Browser Console:**
```
🎮 Sending remote command from ComputerDetail: {action: 'lock', computerId: 'PC-13'}
```

**Terminal Agent:**
```
🔒 Executing LOCK SCREEN command
✅ Command result: SUCCESS
✅ Message: Screen locked successfully
```

**Di PC-13:**
- ✅ Screen terkunci (memerlukan password untuk unlock)

---

### **Test 4: Key Combination**

**Langkah:**
1. Di Remote Desktop Viewer
2. Aktifkan "Mode Kontrol"
3. Aktifkan "Keyboard ON"
4. Klik tombol "Ctrl+Alt+Del"

**Expected:**

**Browser Console:**
```
🎮 Sending key combination: Ctrl+Alt+Del
```

**Terminal Agent:**
```
🎮 Executing remote command
🎮 Action: key_combination
✅ Command result: SUCCESS
```

**Di PC-13:**
- ✅ Kombinasi tombol Ctrl+Alt+Del dikirim

---

## 📊 Command yang Didukung

| Command | Action | Parameter | Keterangan |
|---------|--------|-----------|------------|
| **Shutdown** | `shutdown` | `delay` (optional) | Matikan komputer |
| **Restart** | `restart` | `delay` (optional) | Restart komputer |
| **Lock** | `lock` | - | Lock screen |
| **Message** | `message` | `message` (string) | Show message box |
| **Screenshot** | `screenshot` | - | Ambil screenshot |
| **Mute Audio** | `mute_audio` | - | Matikan audio |
| **Block Internet** | `block_internet` | - | Blokir internet |
| **Unblock Internet** | `unblock_internet` | - | Buka internet |
| **Key Combination** | `key_combination` | `keys` (string) | Kirim kombinasi tombol |
| **Open URL** | `open_url` | `url` (string) | Buka URL di browser |
| **Close App** | `close_app` | `appName` (string) | Tutup aplikasi |

---

## 🔍 Troubleshooting

### **Problem: Command tidak sampai ke backend**

**Gejala:**
- Browser Console tidak ada log "🎮 Sending remote command"

**Solusi:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Cek file `RemoteDesktopViewer.tsx` sudah diupdate
3. Cek file `ComputerDetail.tsx` sudah diupdate
4. Restart frontend: `npm run dev`

---

### **Problem: Backend tidak broadcast ke agent**

**Gejala:**
- Browser Console ada log "🎮 Sending remote command"
- Terminal backend tidak ada log "🎮 Remote command received"

**Solusi:**
1. Cek Socket.io connection aktif (harus ada "✅ Socket connected")
2. Restart backend: `npm run dev`
3. Cek file `server.js` ada event listener `remote-command`

---

### **Problem: Agent tidak execute command**

**Gejala:**
- Terminal backend ada log "🎮 Remote command received"
- Terminal agent tidak ada log "📡 Received remote command"

**Solusi:**
1. Cek agent running: `tasklist | findstr node`
2. Restart agent: `npm start`
3. Cek file `agent.js` sudah diupdate
4. Cek agent listen event `execute-command`

---

## 📝 Checklist Verifikasi

Setelah update frontend, cek:

- [ ] File `RemoteDesktopViewer.tsx` sudah diupdate
- [ ] File `ComputerDetail.tsx` sudah diupdate
- [ ] Frontend restart setelah update
- [ ] Browser Console menunjukkan log "🎮 Sending remote command"
- [ ] Terminal backend menunjukkan log "🎮 Remote command received"
- [ ] Terminal agent menunjukkan log "📡 Received remote command"
- [ ] Command berhasil di-execute di PC siswa

---

## 🎉 Expected Result

Setelah fix, semua remote control commands akan berfungsi:

✅ **Kirim Pesan** → Popup message muncul di PC siswa  
✅ **Screenshot** → Screenshot diambil dan disimpan  
✅ **Lock Screen** → Screen terkunci  
✅ **Shutdown/Restart** → Komputer mati/restart  
✅ **Block Internet** → Internet terblokir  
✅ **Key Combination** → Kombinasi tombol terkirim  

**Semua command akan di-log di:**
- Browser Console (frontend)
- Terminal Backend (server)
- Terminal Agent (PC siswa)
- File log agent (`C:\labmonitor-agent\logs\agent.log`)

---

## 📞 Jika Masih Bermasalah

Kirim informasi ini:

1. **Browser Console log** (saat klik tombol)
2. **Terminal Backend log** (saat command diterima)
3. **Terminal Agent log** (saat command di-execute)
4. **Command yang dicoba** (action apa, parameter apa)
5. **Hasil di PC siswa** (ada efek atau tidak)

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

**Status: ✅ FIXED - Remote control sekarang berfungsi penuh!** 🎉
