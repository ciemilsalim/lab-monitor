# 🚀 QUICK DEPLOY - Copy-Paste Backend

## 📋 Cara Deploy (SUPER SIMPLE)

### **LANGKAH 1: Copy Folder Backend**

```bash
# Dari folder project ini, copy ke folder backend Anda
copy agent\backend D:\labmonitor-backend /E /I /Y
```

**Atau Manual:**
1. Buka File Explorer
2. Navigate ke: `agent\backend\`
3. **Select All** (Ctrl+A)
4. **Copy** (Ctrl+C)
5. Navigate ke: `D:\labmonitor-backend\`
6. **Paste** (Ctrl+V)
7. **Replace all files** jika ditanya

---

### **LANGKAH 2: Install Dependencies**

```bash
cd D:\labmonitor-backend
npm install
```

**Expected Output:**
```
added XXX packages in Xs
```

---

### **LANGKAH 3: Setup Environment**

```bash
# Copy .env.example ke .env
copy .env.example .env

# Edit .env dengan konfigurasi Anda
notepad .env
```

**Konfigurasi yang perlu diubah:**
```env
# Server
PORT=3001
HOST=0.0.0.0

# Database (Laragon MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=labmonitor

# JWT Secret (GANTI DENGAN RANDOM STRING!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS (sesuaikan dengan IP server Anda)
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_NETWORK=http://192.168.100.166:3000
```

**Save** (Ctrl+S) dan **Close** (Alt+F4)

---

### **LANGKAH 4: Setup Database**

```bash
# Buka phpMyAdmin
start http://localhost/phpmyadmin
```

**Di phpMyAdmin:**
1. Klik tab **"SQL"**
2. Copy-paste isi file `database/schema.sql`
3. Klik **"Go"**

**Atau via Command Line:**
```bash
# Import schema
mysql -u root -p labmonitor < database/schema.sql
```

---

### **LANGKAH 5: Start Backend**

```bash
npm run dev
```

**Expected Output:**
```
✅ MySQL Connected successfully

🚀 ========================================
🚀 LabMonitor Backend Server v1.3
🚀 ========================================
📡 Local:   http://localhost:3001
📡 Network: http://192.168.100.166:3001
🚀 ========================================

✅ Socket.io ready
✅ Alert Engine ENABLED
✅ Real-time alerts ENABLED
✅ Auto-generate alerts ENABLED

📋 Alert Rules:
   - Non-educational sites: ON
   - High bandwidth (>50 Mbps): ON
   - High CPU (>90%): ON
   - High RAM (>90%): ON
```

---

### **LANGKAH 6: Test Backend**

```bash
# Test health check
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-10-08T...",
  "uptime": 123.45
}
```

```bash
# Test get computers
curl http://localhost:3001/api/computers
```

**Expected Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### **LANGKAH 7: Test Alert Engine**

**Di PC siswa:**
1. Buka browser
2. Akses: `https://www.instagram.com`
3. Tunggu 10-15 detik

**Di dashboard admin:**
1. Buka: `http://localhost:3000`
2. Klik menu **"Peringatan"**
3. Harus muncul alert baru:
   ```
   ⚠️ Mengakses situs non-edukasi: instagram.com
   👤 Siswa: Ahmad Rizki
   🖥️ Komputer: PC-01
   ```

---

## 📁 Struktur Folder yang Di-Copy

```
D:\labmonitor-backend\
├── src/
│   ├── config/
│   │   └── database.js          ✅ Database connection
│   ├── routes/
│   │   ├── computers.js         ✅ Computer CRUD
│   │   ├── students.js          ✅ Student CRUD
│   │   ├── activities.js        ✅ Activity logs
│   │   ├── alerts.js            ✅ Alerts CRUD
│   │   └── cleanup.js           ✅ Cleanup & maintenance
│   ├── services/
│   │   └── alertEngine.js       ✅ Auto-generate alerts
│   └── server.js                ✅ Main server (v1.3)
├── database/
│   └── schema.sql               ✅ Database schema
├── .env.example                 ✅ Environment template
├── .env                         ✅ Your configuration
├── package.json                 ✅ Dependencies
├── README.md                    ✅ Documentation
└── QUICK-DEPLOY.md              ✅ This file
```

---

## 🔍 Troubleshooting

### **Error: Cannot find module**
```bash
npm install
```

### **Error: Database connection failed**
- Cek Laragon MySQL running
- Cek `.env` database config
- Test connection: `mysql -u root -p`

### **Error: Port already in use**
```bash
# Edit .env
PORT=3002
```

### **Alert tidak muncul**
- Cek backend log: harus ada "🚨 Alert generated"
- Cek frontend console: harus ada "🚨 New alert received"
- Restart backend dan frontend

---

## ✅ Checklist Deploy

- [ ] Copy folder `agent/backend` ke `D:\labmonitor-backend`
- [ ] Run `npm install`
- [ ] Copy `.env.example` ke `.env`
- [ ] Edit `.env` dengan konfigurasi Anda
- [ ] Setup database di phpMyAdmin
- [ ] Import `database/schema.sql`
- [ ] Run `npm run dev`
- [ ] Test health check: `http://localhost:3001/health`
- [ ] Test alert engine dengan buka Instagram
- [ ] Cek dashboard admin untuk alert baru

---

## 🎉 SELESAI!

Backend sudah siap digunakan dengan fitur:
- ✅ Alert Engine dengan auto-detection
- ✅ Real-time alerts via Socket.io
- ✅ Configurable alert rules
- ✅ Cooldown system (5 minutes)
- ✅ Cleanup & maintenance
- ✅ Database optimization

**Status:** ✅ **READY TO USE** 🚀

---

## 📞 Support

**Documentation:**
- `README.md` - Full documentation
- `ALERT-ENGINE-IMPLEMENTATION.md` - Alert Engine detail
- `AUDIT-ALERT-FEATURE.md` - Audit report

**Developer:** zahradev  
**Version:** 1.3  
**Status:** ✅ Production Ready
