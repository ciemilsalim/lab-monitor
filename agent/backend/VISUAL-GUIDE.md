# 🎯 VISUAL GUIDE - Deploy Backend (No Confusion!)

## 📍 LANGKAH 1: Copy Folder

```
┌─────────────────────────────────────────────────────────────┐
│  DARI:                                                      │
│  📁 agent\backend\                                          │
│  └── 📁 src\                                                │
│  └── 📁 database\                                           │
│  └── 📄 package.json                                        │
│  └── 📄 .env.example                                        │
│  └── 📄 README.md                                           │
│  └── 📄 QUICK-DEPLOY.md                                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ COPY ALL
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  KE:                                                        │
│  📁 D:\labmonitor-backend\                                  │
│  └── 📁 src\                                                │
│  └── 📁 database\                                           │
│  └── 📄 package.json                                        │
│  └── 📄 .env                                                │
│  └── 📄 README.md                                           │
└─────────────────────────────────────────────────────────────┘
```

**Command:**
```bash
copy agent\backend D:\labmonitor-backend /E /I /Y
```

---

## 📍 LANGKAH 2: Install Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│  D:\labmonitor-backend>                                     │
│                                                             │
│  > npm install                                              │
│                                                             │
│  ⏳ Installing packages...                                  │
│  ✅ added 234 packages in 12s                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 LANGKAH 3: Setup .env

```
┌─────────────────────────────────────────────────────────────┐
│  D:\labmonitor-backend>                                     │
│                                                             │
│  > copy .env.example .env                                   │
│  > notepad .env                                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ # Server                                              │ │
│  │ PORT=3001                                             │ │
│  │ HOST=0.0.0.0                                          │ │
│  │                                                       │ │
│  │ # Database                                            │ │
│  │ DB_HOST=localhost                                     │ │
│  │ DB_PORT=3306                                          │ │
│  │ DB_USER=root                                          │ │
│  │ DB_PASSWORD=                                          │ │
│  │ DB_NAME=labmonitor                                    │ │
│  │                                                       │ │
│  │ # JWT Secret (GANTI INI!)                             │ │
│  │ JWT_SECRET=my-super-secret-key-12345                  │ │
│  │                                                       │ │
│  │ # CORS                                                │ │
│  │ CORS_ORIGIN=http://localhost:3000                     │ │
│  │ CORS_ORIGIN_NETWORK=http://192.168.100.166:3000       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Save (Ctrl+S) → Close (Alt+F4)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 LANGKAH 4: Setup Database

```
┌─────────────────────────────────────────────────────────────┐
│  BUKA phpMyAdmin:                                           │
│  http://localhost/phpmyadmin                                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Klik tab "SQL"                                          │
│                                                             │
│  2. Copy isi file:                                          │
│     D:\labmonitor-backend\database\schema.sql               │
│                                                             │
│  3. Paste di SQL editor                                     │
│                                                             │
│  4. Klik "Go"                                               │
│                                                             │
│  ✅ Database created successfully!                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 LANGKAH 5: Start Backend

```
┌─────────────────────────────────────────────────────────────┐
│  D:\labmonitor-backend>                                     │
│                                                             │
│  > npm run dev                                              │
│                                                             │
│  ✅ MySQL Connected successfully                            │
│                                                             │
│  🚀 ========================================                │
│  🚀 LabMonitor Backend Server v1.3                          │
│  🚀 ========================================                │
│  📡 Local:   http://localhost:3001                          │
│  📡 Network: http://192.168.100.166:3001                    │
│  🚀 ========================================                │
│                                                             │
│  ✅ Socket.io ready                                         │
│  ✅ Alert Engine ENABLED                                    │
│  ✅ Real-time alerts ENABLED                                │
│  ✅ Auto-generate alerts ENABLED                            │
│                                                             │
│  📋 Alert Rules:                                            │
│     - Non-educational sites: ON                             │
│     - High bandwidth (>50 Mbps): ON                         │
│     - High CPU (>90%): ON                                   │
│     - High RAM (>90%): ON                                   │
└─────────────────────────────────────────────────────────────┘
```

**⚠️ JANGAN TUTUP WINDOW INI!**

---

## 📍 LANGKAH 6: Test Backend

```
┌─────────────────────────────────────────────────────────────┐
│  BUKA BROWSER:                                              │
│  http://localhost:3001/health                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  {                                                          │
│    "status": "OK",                                          │
│    "timestamp": "2026-10-08T12:00:00.000Z",                 │
│    "uptime": 123.45                                         │
│  }                                                          │
│                                                             │
│  ✅ BACKEND BERJALAN!                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 LANGKAH 7: Test Alert Engine

```
┌─────────────────────────────────────────────────────────────┐
│  DI PC SISWA:                                               │
│                                                             │
│  1. Buka browser                                            │
│  2. Akses: https://www.instagram.com                        │
│  3. Tunggu 10-15 detik                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  DI BACKEND LOG:                                            │
│                                                             │
│  🌐 Activity log received from: PC-01                       │
│  ✅ Activity saved to database, ID: 123                     │
│  🚨 Alert generated: warning - Mengakses situs non-edukasi │
│                                                             │
│  ✅ ALERT ENGINE BERFUNGSI!                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  DI DASHBOARD ADMIN:                                        │
│  http://localhost:3000                                      │
│                                                             │
│  1. Klik menu "Peringatan"                                  │
│  2. Harus muncul alert baru:                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠️ Mengakses situs non-edukasi: instagram.com       │   │
│  │ 👤 Siswa: Ahmad Rizki                               │   │
│  │ 🖥️ Komputer: PC-01                                  │   │
│  │ 🕐 10:30                                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ✅ ALERT MUNCUL DI DASHBOARD!                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎉 SELESAI!

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ✅ Backend berjalan di port 3001                           │
│  ✅ Database terhubung                                      │
│  ✅ Alert Engine aktif                                      │
│  ✅ Real-time alerts berfungsi                              │
│  ✅ Auto-generate alerts bekerja                            │
│                                                             │
│  🎊 DEPLOYMENT SUCCESSFUL!                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist Final

- [ ] ✅ Folder backend di-copy ke `D:\labmonitor-backend`
- [ ] ✅ Dependencies terinstall (`npm install`)
- [ ] ✅ File `.env` sudah dikonfigurasi
- [ ] ✅ Database schema sudah di-import
- [ ] ✅ Backend running (`npm run dev`)
- [ ] ✅ Health check berhasil (`http://localhost:3001/health`)
- [ ] ✅ Alert engine test berhasil (buka Instagram)
- [ ] ✅ Alert muncul di dashboard admin

---

## 🆘 Jika Ada Masalah

### **Error: Cannot find module**
```bash
npm install
```

### **Error: Database connection failed**
- Cek Laragon MySQL running
- Cek `.env` database config

### **Alert tidak muncul**
- Cek backend log
- Restart backend dan frontend

---

## 📞 Quick Commands

```bash
# Start backend
cd D:\labmonitor-backend
npm run dev

# Stop backend
# Tekan Ctrl+C

# Check logs
# Lihat di terminal backend

# Test health
curl http://localhost:3001/health

# Test computers
curl http://localhost:3001/api/computers

# Test alerts
curl http://localhost:3001/api/alerts
```

---

**Status:** ✅ **READY TO USE** 🚀

**Developer:** zahradev  
**Version:** 1.3  
**Last Updated:** 8 Oktober 2026
