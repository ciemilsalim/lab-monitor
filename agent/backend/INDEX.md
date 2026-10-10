# 📚 INDEX - Daftar Isi Backend

## 🎯 Mulai Dari Sini

**👉 BACA INI DULU:** [START-HERE.md](START-HERE.md)

---

## 📖 Dokumentasi

| File | Deskripsi | Baca Ketika |
|------|-----------|-------------|
| **[START-HERE.md](START-HERE.md)** | Quick start 3 langkah | Pertama kali deploy |
| **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** | Panduan copy-paste detail | Butuh langkah detail |
| **[VISUAL-GUIDE.md](VISUAL-GUIDE.md)** | Panduan visual dengan diagram | Lebih suka visual |
| **[README.md](README.md)** | Dokumentasi lengkap API & fitur | Butuh info lengkap |

---

## 📁 Struktur Folder

```
backend/
├── 📄 START-HERE.md          ← Mulai dari sini!
├── 📄 INDEX.md                ← File ini (daftar isi)
├── 📄 README.md               ← Dokumentasi lengkap
├── 📄 QUICK-DEPLOY.md         ← Panduan cepat
├── 📄 VISUAL-GUIDE.md         ← Panduan visual
├── 📄 package.json            ← Dependencies
├── 📄 .env.example            ← Template environment
│
├── 📁 src/
│   ├── 📄 server.js           ← Main server (v1.3)
│   │
│   ├── 📁 config/
│   │   └── 📄 database.js     ← Database connection
│   │
│   ├── 📁 services/
│   │   └── 📄 alertEngine.js  ← Alert Engine logic
│   │
│   └── 📁 routes/
│       ├── 📄 computers.js    ← Computer API
│       ├── 📄 students.js     ← Student API
│       ├── 📄 activities.js   ← Activity API
│       ├── 📄 alerts.js       ← Alert API
│       └── 📄 cleanup.js      ← Cleanup API
│
└── 📁 database/
    └── 📄 schema.sql          ← Database schema
```

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Setup environment
copy .env.example .env
notepad .env

# Start backend
npm run dev

# Test health
curl http://localhost:3001/health

# Test computers
curl http://localhost:3001/api/computers

# Test alerts
curl http://localhost:3001/api/alerts
```

---

## 📊 API Endpoints

### **Computers**
- `GET /api/computers` - Get all computers
- `GET /api/computers/:id` - Get computer by ID
- `PUT /api/computers/:id/status` - Update status

### **Students**
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID

### **Activities**
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create activity

### **Alerts**
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/read` - Mark as read

### **Cleanup**
- `GET /api/cleanup/stats` - Get statistics
- `DELETE /api/cleanup/activities` - Cleanup activities
- `DELETE /api/cleanup/alerts` - Cleanup alerts
- `DELETE /api/cleanup/screenshots` - Cleanup screenshots
- `DELETE /api/cleanup/all` - Full cleanup
- `POST /api/cleanup/optimize` - Optimize database

### **Alert Rules**
- `GET /api/alert-rules` - Get rules
- `PUT /api/alert-rules` - Update rules

### **Health**
- `GET /` - Server info
- `GET /health` - Health check

---

## 🎯 Fitur Utama

### **1. Alert Engine**
- ✅ Auto-detect situs non-edukasi
- ✅ Auto-detect bandwidth tinggi
- ✅ Auto-detect CPU/RAM tinggi
- ✅ Real-time notification
- ✅ Cooldown system (5 menit)

### **2. Real-time Communication**
- ✅ Socket.io untuk real-time updates
- ✅ Computer status tracking
- ✅ Activity monitoring
- ✅ Alert notifications

### **3. Database Management**
- ✅ MySQL connection pooling
- ✅ Optimized queries
- ✅ Indexes for performance
- ✅ Cleanup & maintenance

### **4. Remote Control**
- ✅ Mouse & keyboard control
- ✅ Screenshot capture
- ✅ Internet block/unblock
- ✅ Shutdown/restart/lock

---

## 🔧 Konfigurasi

### **Environment Variables (.env)**

```env
# Server
PORT=3001
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=labmonitor

# JWT
JWT_SECRET=your-secret-key

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN_NETWORK=http://192.168.100.166:3000

# Socket.io
SOCKET_PING_INTERVAL=25000
SOCKET_PING_TIMEOUT=60000
```

---

## 📈 Performance

- ⚡ Alert generation: < 100ms
- ⚡ Database insert: ~5ms
- ⚡ Socket broadcast: < 50ms
- ⚡ Total latency: < 200ms

---

## 🆘 Troubleshooting

### **Error: Cannot find module**
```bash
npm install
```

### **Error: Database connection failed**
- Cek Laragon MySQL running
- Cek `.env` database config

### **Error: Port already in use**
```bash
# Edit .env
PORT=3002
```

### **Alert tidak muncul**
- Cek backend log
- Restart backend dan frontend

---

## 📞 Support

**Documentation:**
- [START-HERE.md](START-HERE.md) - Quick start
- [QUICK-DEPLOY.md](QUICK-DEPLOY.md) - Detail guide
- [VISUAL-GUIDE.md](VISUAL-GUIDE.md) - Visual guide
- [README.md](README.md) - Full documentation

**Developer:** zahradev  
**Version:** 1.3  
**Status:** ✅ Production Ready

---

## ✅ Checklist Deploy

- [ ] Baca [START-HERE.md](START-HERE.md)
- [ ] Copy folder backend
- [ ] Run `npm install`
- [ ] Setup `.env`
- [ ] Import database schema
- [ ] Run `npm run dev`
- [ ] Test health check
- [ ] Test alert engine

---

**Last Updated:** 8 Oktober 2026
