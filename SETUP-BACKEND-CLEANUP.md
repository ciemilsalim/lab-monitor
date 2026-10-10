# 🔧 Setup Backend Cleanup Routes

## 📋 Instruksi Setup

Untuk mengaktifkan fitur Cleanup, Anda perlu mendaftarkan route cleanup di backend server.

---

## 🚀 Langkah 1: Copy File Route

Copy file `backend-routes-cleanup.js` ke folder backend Anda:

```bash
# Dari project ini
copy agent\backend-routes-cleanup.js D:\labmonitor-backend\src\routes\cleanup.js
```

Atau manual:
1. Buka file `agent/backend-routes-cleanup.js`
2. Copy semua isinya
3. Buat file baru di `D:\labmonitor-backend\src\routes\cleanup.js`
4. Paste dan save

---

## 🚀 Langkah 2: Register Route di server.js

Buka file `D:\labmonitor-backend\src\server.js` dan tambahkan baris berikut:

### **Di bagian import routes (sekitar line 50-60):**

```javascript
// ========================================
// API ROUTES
// ========================================
app.use('/api/computers', require('./routes/computers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/cleanup', require('./routes/cleanup')); // ← TAMBAHKAN INI
```

---

## 🚀 Langkah 3: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Lalu start lagi
cd D:\labmonitor-backend
npm run dev
```

**Expected output:**
```
🚀 ========================================
🚀 LabMonitor Backend Server v1.2.0
🚀 ========================================
✅ Socket.io ready for connections
✅ Real-time connection tracking ENABLED
✅ Auto-offline on disconnect ENABLED
✅ Cleanup routes ENABLED  ← INI
🚀 ========================================
```

---

## 🧪 Test API Endpoints

### **Test 1: Get Stats**
```bash
curl http://localhost:3001/api/cleanup/stats
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "activities": {
      "total": 1234,
      "older_than_7_days": 456,
      "older_than_30_days": 890
    },
    "browser_tabs": {
      "total": 5678
    },
    "alerts": {
      "total": 89
    },
    "database_size": {
      "tables": [...],
      "total_mb": "45.23"
    }
  }
}
```

### **Test 2: Cleanup Activities**
```bash
curl -X DELETE http://localhost:3001/api/cleanup/activities \
  -H "Content-Type: application/json" \
  -d '{"days": 7}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Cleanup completed",
  "data": {
    "deleted_activities": 456,
    "deleted_browser_tabs": 1234,
    "older_than_days": 7
  }
}
```

---

## 🎨 Akses di Frontend

Setelah backend setup selesai:

1. Login ke dashboard admin
2. Klik menu **"Cleanup"** di sidebar (icon 🗑️)
3. Halaman cleanup akan terbuka
4. Lihat statistik data
5. Konfigurasi periode cleanup
6. Klik tombol cleanup yang diinginkan
7. Konfirmasi aksi
8. Lihat hasil cleanup

---

## 🔍 Troubleshooting

### **Error: Cannot find module './routes/cleanup'**

**Penyebab:** File cleanup.js belum di-copy ke folder routes

**Solusi:**
```bash
# Copy file
copy agent\backend-routes-cleanup.js D:\labmonitor-backend\src\routes\cleanup.js

# Restart backend
cd D:\labmonitor-backend
npm run dev
```

### **Error: Route not registered**

**Penyebab:** Route belum didaftarkan di server.js

**Solusi:**
1. Buka `D:\labmonitor-backend\src\server.js`
2. Cari bagian `// API ROUTES`
3. Tambahkan: `app.use('/api/cleanup', require('./routes/cleanup'));`
4. Save dan restart backend

### **Error: Database connection failed**

**Penyebab:** Database connection hilang

**Solusi:**
1. Cek Laragon MySQL running
2. Cek `.env` database configuration
3. Restart backend

---

## ✅ Checklist Setup

- [ ] Copy file `backend-routes-cleanup.js` ke `src/routes/cleanup.js`
- [ ] Register route di `server.js`
- [ ] Restart backend
- [ ] Test endpoint `/api/cleanup/stats`
- [ ] Akses menu Cleanup di frontend
- [ ] Test cleanup activities
- [ ] Test cleanup alerts
- [ ] Test cleanup screenshots
- [ ] Test full cleanup
- [ ] Test optimize database

---

## 📊 Expected Result

Setelah setup selesai:

✅ **Backend:**
- Route `/api/cleanup/*` aktif
- Bisa hapus data lama
- Bisa optimasi database

✅ **Frontend:**
- Menu Cleanup muncul di sidebar
- Statistik data real-time
- Bisa cleanup per tipe
- Bisa full cleanup
- Bisa optimasi database

✅ **Database:**
- Ukuran berkurang setelah cleanup
- Performa lebih cepat
- Disk space reclaimed

---

**Status:** ✅ **READY TO SETUP** 🎉
