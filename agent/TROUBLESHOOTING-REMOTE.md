# 🔧 Troubleshooting Remote Control

## Masalah: Command Diterima Tapi Tidak Di-execute

### Gejala:
- ✅ Monitoring berfungsi (data masuk ke database)
- ❌ Remote control tidak berfungsi
- ✅ Pesan hijau muncul di server (command diterima)
- ❌ Tidak ada efek di komputer siswa

---

## ✅ Solusi: Update Agent Code

### Langkah 1: Update File Agent

**Di PC-13 (atau semua PC siswa):**

```cmd
cd C:\labmonitor-agent
```

**Edit file `src/agent.js`:**

Cari bagian `setupRemoteCommands()` dan ganti dengan kode baru yang sudah saya update.

**Atau copy dari file ini:**
- `agent/src/agent.js` (sudah diupdate)

**Edit file `src/controllers/remote.js`:**

Cari bagian `async execute(command)` dan ganti dengan kode baru.

**Atau copy dari file ini:**
- `agent/src/controllers/remote.js` (sudah diupdate)

### Langkah 2: Restart Agent

```cmd
# Stop agent
# Tekan Ctrl+C

# Start agent lagi
npm start
```

**Output yang diharapkan:**
```
🚀 LabMonitor Agent Starting...
✅ Connected to backend
✅ Agent started successfully
✅ Remote command listener active  ← INI PENTING!
```

### Langkah 3: Test Remote Control

**Di dashboard admin:**

1. Klik komputer PC-13
2. Tab "Kontrol"
3. Test command sederhana dulu:

**Test 1: Show Message**
```
Klik "Kirim Pesan"
Masukkan pesan: "Test dari admin"
Klik "Kirim"
```

**Expected di PC-13:**
- Muncul popup message box
- Agent log: `💬 Executing SHOW MESSAGE command`

**Test 2: Lock Screen**
```
Klik "Lock Screen"
```

**Expected di PC-13:**
- Screen terkunci
- Agent log: `🔒 Executing LOCK SCREEN command`

### Langkah 4: Cek Log Agent

**Di PC-13:**

```cmd
type logs\agent.log
```

**Cari log seperti ini:**

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

**Jika muncul log di atas** → Agent menerima dan execute command ✅

**Jika tidak muncul log** → Agent tidak listen event ❌

---

## 🔍 Troubleshooting Lanjutan

### Problem 1: Agent Tidak Listen Command

**Gejala:**
- Tidak ada log "📡 Received remote command"
- Command tidak di-execute

**Solusi:**

1. **Cek agent.js** - pastikan `setupRemoteCommands()` dipanggil:

```javascript
async start() {
  // ... kode lain
  
  // Setup remote command listener
  this.setupRemoteCommands();  ← INI HARUS ADA!
  
  this.isRunning = true;
  logger.info('✅ Agent started successfully');
}
```

2. **Restart agent** setelah update code

3. **Cek log startup** - harus ada:
```
✅ Remote command listener active
```

### Problem 2: Command Execute Tapi Tidak Ada Efek

**Gejala:**
- Log menunjukkan "✅ Command executed successfully"
- Tapi tidak ada efek di komputer

**Penyebab:**
- Agent tidak running sebagai **Administrator**
- Beberapa command butuh admin privilege

**Solusi:**

**Option 1: Run agent as Administrator**

```cmd
# Stop agent dulu (Ctrl+C)

# Run as admin
# Right-click Command Prompt → Run as Administrator

cd C:\labmonitor-agent
npm start
```

**Option 2: Install as Windows Service**

```cmd
cd C:\labmonitor-agent
npm run install-service
```

Service akan run dengan SYSTEM privilege (full admin).

### Problem 3: Command Tidak Sampai ke Agent

**Gejala:**
- Frontend kirim command
- Backend terima command (log hijau)
- Agent tidak terima command

**Penyebab:**
- Backend tidak broadcast ke agent yang benar
- Agent tidak listen event yang tepat

**Solusi:**

1. **Cek backend log** - harus ada:
```
🎮 Remote command received: { action: 'message', computerId: 'PC-13' }
```

2. **Cek backend code** - pastikan broadcast ke agent:

```javascript
// Di server.js
socket.on('remote-command', (data) => {
  console.log('🎮 Remote command received:', data);
  
  // Broadcast ke semua clients (termasuk agent)
  io.emit('execute-command', data);
});
```

3. **Cek agent listen event** - harus listen `execute-command`:

```javascript
// Di agent.js
this.socketService.on('execute-command', async (command) => {
  // ... execute command
});
```

### Problem 4: Specific Commands Tidak Bekerja

#### Shutdown/Restart tidak bekerja

**Penyebab:** Butuh admin privilege

**Solusi:**
```cmd
# Run agent as Administrator
# Atau install as Windows Service
npm run install-service
```

#### Lock Screen tidak bekerja

**Penyebab:** Butuh admin privilege

**Solusi:** Sama seperti shutdown/restart

#### Block Internet tidak bekerja

**Penyebab:** 
- Butuh admin privilege
- Firewall rule tidak di-create

**Solusi:**
```cmd
# Run as admin
# Cek firewall rule
netsh advfirewall firewall show rule name="LabMonitor_Block"
```

#### Show Message tidak bekerja

**Penyebab:** 
- VBScript tidak bisa run
- User interaction disabled

**Solusi:**
```cmd
# Test manual
cscript //nologo "C:\Users\...\AppData\Local\Temp\labmonitor_message.vbs"
```

---

## 📋 Checklist Troubleshooting

### Agent Setup:
- [ ] Agent code sudah diupdate (`agent.js`, `remote.js`)
- [ ] Agent restart setelah update
- [ ] Log menunjukkan "✅ Remote command listener active"
- [ ] Agent running as Administrator (untuk command tertentu)

### Backend Setup:
- [ ] Backend listen `remote-command` dari frontend
- [ ] Backend broadcast `execute-command` ke agent
- [ ] Backend log menunjukkan command diterima

### Network:
- [ ] Agent connected ke backend (cek log agent)
- [ ] Socket.io connection stable
- [ ] Tidak ada firewall blocking

### Testing:
- [ ] Test dengan command sederhana (message, lock)
- [ ] Cek log agent untuk detail execution
- [ ] Cek log backend untuk broadcast status

---

## 🎯 Command yang Butuh Admin Privilege

| Command | Butuh Admin? | Keterangan |
|---------|--------------|------------|
| `shutdown` | ✅ YES | Matikan komputer |
| `restart` | ✅ YES | Restart komputer |
| `lock` | ✅ YES | Lock screen |
| `block_internet` | ✅ YES | Modifikasi firewall |
| `unblock_internet` | ✅ YES | Modifikasi firewall |
| `message` | ❌ NO | Show message box |
| `screenshot` | ❌ NO | Ambil screenshot |
| `open_url` | ❌ NO | Buka browser |
| `close_app` | ⚠️ MAYBE | Tergantung aplikasi |

**Rekomendasi:** Install agent sebagai Windows Service untuk full functionality.

---

## 🔧 Quick Fix

Jika remote control masih tidak bekerja setelah update code:

```cmd
# 1. Stop agent
cd C:\labmonitor-agent
# Ctrl+C

# 2. Run as Administrator
# Right-click Command Prompt → Run as Administrator

# 3. Start agent
cd C:\labmonitor-agent
npm start

# 4. Test command sederhana
# Di dashboard: Kirim Pesan → "Test"

# 5. Cek log
type logs\agent.log
```

**Expected log:**
```
📡 Received remote command
📡 Action: message
🎮 Executing remote command
💬 Executing SHOW MESSAGE command
✅ Command result: SUCCESS
```

---

## 📞 Jika Masih Bermasalah

Kirim informasi ini:

1. **Log agent** (50 baris terakhir):
```cmd
type logs\agent.log
```

2. **Log backend** (saat kirim command):
```
# Copy log dari terminal backend
```

3. **Command yang dicoba**:
- Action apa?
- Parameter apa?
- Hasil di dashboard?

4. **Status agent**:
- Running as admin?
- Service atau manual?
- Versi Node.js?

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

## ✅ Expected Behavior

Setelah fix, flow remote control:

```
1. Admin klik "Lock Screen" di dashboard
   ↓
2. Frontend emit 'remote-command' ke backend
   ↓
3. Backend terima & broadcast 'execute-command'
   ↓
4. Agent terima command
   ↓
5. Agent log: "📡 Received remote command"
   ↓
6. Agent execute: "🔒 Executing LOCK SCREEN command"
   ↓
7. PC-13 screen terkunci
   ↓
8. Agent emit 'command-result' ke backend
   ↓
9. Backend broadcast ke frontend
   ↓
10. Dashboard update status
```

**Semua step harus berhasil!** 🎉
