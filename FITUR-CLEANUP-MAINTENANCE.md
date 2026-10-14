# 🧹 Fitur Cleanup & Maintenance

## 📋 Overview

Fitur **Cleanup & Maintenance** memungkinkan admin untuk membersihkan data lama (aktivitas browsing, alerts, screenshot) agar server tidak terbebani dengan data yang tidak diperlukan lagi.

---

## 🎯 Fitur Utama

### **1. Statistik Data Real-time**
- Total aktivitas browsing
- Total browser tabs terekam
- Total alerts/notifikasi
- Ukuran database dalam MB
- Jumlah data older than 7 hari
- Jumlah data older than 30 hari

### **2. Cleanup Aktivitas**
- Hapus aktivitas browsing lama
- Hapus browser tabs terkait
- Konfigurasi jumlah hari (default: 7 hari)
- Cascade delete (aktivitas + tabs)

### **3. Cleanup Alerts**
- Hapus notifikasi/alerts lama
- Konfigurasi jumlah hari (default: 30 hari)
- Opsi hapus hanya yang sudah dibaca

### **4. Cleanup Screenshot**
- Hapus file screenshot lama
- Konfigurasi jumlah hari (default: 7 hari)
- Reclaim disk space

### **5. Cleanup Semua (Full Cleanup)**
- Hapus aktivitas + alerts + screenshot sekaligus
- Konfigurasi terpisah untuk setiap tipe
- Konfirmasi sebelum eksekusi

### **6. Optimasi Database**
- Run `OPTIMIZE TABLE` untuk reclaim space
- Defragment database
- Improve query performance

---

## 🚀 Cara Menggunakan

### **Akses Menu Cleanup**

1. Login ke dashboard admin
2. Klik menu **"Cleanup"** di sidebar (icon 🗑️)
3. Halaman cleanup akan terbuka

### **Melihat Statistik**

Halaman akan menampilkan:
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  Aktivitas   │ Browser Tabs │    Alerts    │ Database Size│
│    1,234     │    5,678     │     89       │   45.23 MB   │
│ 456 > 7 hari │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### **Konfigurasi Cleanup**

Atur berapa hari data yang akan dihapus:

```
┌─────────────────────────────────────────────────────────┐
│ Pengaturan Cleanup                                      │
├─────────────────────────────────────────────────────────┤
│ Hapus aktivitas lebih lama dari: [  7  ] hari          │
│ Hapus alerts lebih lama dari:    [ 30  ] hari          │
│ Hapus screenshot lebih lama dari: [  7  ] hari          │
└─────────────────────────────────────────────────────────┘
```

### **Menjalankan Cleanup**

**Option 1: Cleanup Spesifik**
- Klik **"Bersihkan Aktivitas"** → Hapus hanya aktivitas lama
- Klik **"Bersihkan Alerts"** → Hapus hanya alerts lama
- Klik **"Bersihkan Screenshot"** → Hapus hanya screenshot lama

**Option 2: Full Cleanup**
- Klik **"Cleanup Semua"** → Hapus semua data lama sekaligus

**Option 3: Optimasi Database**
- Klik **"Optimasi Database"** → Run OPTIMIZE TABLE

### **Konfirmasi**

Setiap aksi cleanup akan menampilkan modal konfirmasi:
```
┌─────────────────────────────────────────┐
│ ⚠️ Konfirmasi Cleanup                   │
├─────────────────────────────────────────┤
│ Anda akan menghapus aktivitas lebih     │
│ lama dari 7 hari. Tindakan ini tidak    │
│ dapat dibatalkan!                       │
│                                         │
│ [ Batal ]  [ Ya, Hapus ]               │
└─────────────────────────────────────────┘
```

### **Melihat Hasil**

Setelah cleanup selesai, akan muncul notifikasi:
```
┌─────────────────────────────────────────┐
│ ✅ Cleanup Berhasil                     │
├─────────────────────────────────────────┤
│ • 456 aktivitas dihapus                 │
│ • 1,234 browser tabs dihapus            │
│ • 23.45 MB ruang dibebaskan             │
└─────────────────────────────────────────┘
```

---

## 🔧 Backend API Endpoints

### **GET /api/cleanup/stats**
Mengambil statistik data untuk ditampilkan di UI.

**Response:**
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

### **DELETE /api/cleanup/activities**
Hapus aktivitas browsing lama.

**Request Body:**
```json
{
  "days": 7
}
```

**Response:**
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

### **DELETE /api/cleanup/alerts**
Hapus alerts lama.

**Request Body:**
```json
{
  "days": 30,
  "read_only": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alerts cleanup completed",
  "data": {
    "deleted_alerts": 89,
    "older_than_days": 30,
    "read_only": false
  }
}
```

### **DELETE /api/cleanup/screenshots**
Hapus file screenshot lama.

**Request Body:**
```json
{
  "days": 7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Screenshots cleanup completed",
  "data": {
    "deleted_files": 123,
    "freed_space_mb": "23.45",
    "older_than_days": 7
  }
}
```

### **DELETE /api/cleanup/all**
Hapus semua data lama sekaligus.

**Request Body:**
```json
{
  "activities_days": 7,
  "alerts_days": 30,
  "screenshots_days": 7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Full cleanup completed",
  "data": {
    "deleted_activities": 456,
    "deleted_browser_tabs": 1234,
    "deleted_alerts": 89,
    "deleted_screenshots": 123,
    "freed_space_mb": "23.45",
    "activities_older_than_days": 7,
    "alerts_older_than_days": 30,
    "screenshots_older_than_days": 7
  }
}
```

### **POST /api/cleanup/optimize**
Optimasi database untuk reclaim space.

**Response:**
```json
{
  "success": true,
  "message": "Database optimization completed"
}
```

---

## 📊 Rekomendasi Jadwal Cleanup

### **Daily (Harian)**
- Tidak perlu cleanup harian
- Monitor ukuran database

### **Weekly (Mingguan)**
- Cleanup aktivitas > 7 hari
- Cleanup screenshot > 7 hari
- Estimasi: 1-2 menit

### **Monthly (Bulanan)**
- Full cleanup (aktivitas + alerts + screenshot)
- Optimasi database
- Estimasi: 5-10 menit

### **Quarterly (3 Bulanan)**
- Full cleanup dengan periode lebih panjang (30 hari)
- Backup database sebelum cleanup
- Optimasi database
- Estimasi: 10-15 menit

---

## 🛡️ Best Practices

### **Sebelum Cleanup**
1. ✅ Backup database terlebih dahulu
2. ✅ Informasikan ke user jika akan ada downtime
3. ✅ Pilih waktu low-traffic (malam hari)
4. ✅ Cek statistik data terlebih dahulu

### **Saat Cleanup**
1. ✅ Gunakan konfirmasi modal
2. ✅ Monitor progress cleanup
3. ✅ Jangan interrupt proses cleanup
4. ✅ Cek log untuk error

### **Setelah Cleanup**
1. ✅ Verifikasi hasil cleanup
2. ✅ Run optimasi database
3. ✅ Cek ukuran database baru
4. ✅ Monitor performa aplikasi

---

## 🔍 Troubleshooting

### **Problem: Cleanup Gagal**

**Gejala:**
- Error message muncul
- Data tidak terhapus

**Solusi:**
1. Cek log backend untuk detail error
2. Pastikan database connection aktif
3. Cek permission untuk hapus data
4. Restart backend jika perlu

### **Problem: Database Tidak Berkurang**

**Gejala:**
- Cleanup berhasil tapi ukuran database tetap

**Solusi:**
1. Run "Optimasi Database" setelah cleanup
2. Cek apakah ada large transactions
3. Restart MySQL service jika perlu

### **Problem: Cleanup Terlalu Lama**

**Gejala:**
- Proses cleanup memakan waktu sangat lama

**Solusi:**
1. Kurangi jumlah hari (misal: 3 hari instead of 7 hari)
2. Cleanup per tipe instead of full cleanup
3. Run saat low-traffic time
4. Tambah resource server (RAM/CPU)

---

## 📈 Monitoring & Reporting

### **Metrics yang Perlu Dimonitor**
- Ukuran database (MB)
- Jumlah aktivitas per hari
- Jumlah alerts per hari
- Jumlah screenshot per hari
- Growth rate database

### **Alert Thresholds**
- Database size > 1 GB → Warning
- Database size > 5 GB → Critical
- Daily activities > 10,000 → Warning
- Cleanup gagal 3x berturut-turut → Critical

### **Reporting**
```
Weekly Report:
- Total activities: 12,345
- Total alerts: 890
- Total screenshots: 2,345
- Database size: 45.23 MB → 32.10 MB (after cleanup)
- Space freed: 13.13 MB
```

---

## 🔐 Security & Permissions

### **Access Control**
- Hanya **Admin** yang bisa akses menu Cleanup
- **Guru** tidak bisa akses (read-only)
- **Viewer** tidak bisa akses sama sekali

### **Audit Log**
Setiap aksi cleanup akan dicatat:
```
[2026-10-08 14:30:00] Admin (admin@labmonitor.local) 
  executed cleanup: activities (older than 7 days)
  Result: 456 activities deleted, 1234 browser tabs deleted
```

### **Data Protection**
- Konfirmasi modal sebelum hapus
- Tidak bisa undo setelah hapus
- Backup database sebelum full cleanup
- Log semua aksi cleanup

---

## 🎯 Use Cases

### **Use Case 1: Routine Maintenance**
**Scenario:** Admin melakukan maintenance mingguan

**Steps:**
1. Backup database
2. Buka menu Cleanup
3. Cek statistik data
4. Klik "Cleanup Semua"
5. Konfirmasi
6. Tunggu selesai
7. Klik "Optimasi Database"
8. Verifikasi hasil

**Result:**
- Database size berkurang 30-50%
- Performa aplikasi lebih cepat
- Disk space reclaimed

### **Use Case 2: Emergency Cleanup**
**Scenario:** Database penuh, aplikasi lambat

**Steps:**
1. Buka menu Cleanup
2. Cek statistik
3. Set periode lebih pendek (3 hari)
4. Klik "Cleanup Semua"
5. Konfirmasi
6. Run "Optimasi Database"
7. Restart backend jika perlu

**Result:**
- Database size berkurang drastis
- Aplikasi kembali normal
- User bisa lanjut bekerja

### **Use Case 3: Scheduled Cleanup**
**Scenario:** Setup automated cleanup (future feature)

**Steps:**
1. Buka menu Cleanup
2. Set jadwal otomatis (cron job)
3. Konfigurasi periode cleanup
4. Enable email notification
5. Save configuration

**Result:**
- Cleanup berjalan otomatis
- Admin terima report via email
- Database selalu optimal

---

## 📚 Files yang Terkait

### **Frontend**
- `src/components/CleanupPanel.tsx` - UI component
- `src/App.tsx` - Route integration
- `src/components/Sidebar.tsx` - Menu integration
- `src/types.ts` - ViewMode type

### **Backend**
- `agent/backend-routes-cleanup.js` - API endpoints
- `agent/backend-server-v1.2.js` - Route registration

### **Database**
- `activities` table - Aktivitas browsing
- `browser_tabs` table - Tab browser
- `alerts` table - Notifikasi/alerts

---

## ✅ Summary

**Fitur Cleanup & Maintenance menyediakan:**

✅ **Statistik Real-time** - Lihat ukuran dan jumlah data  
✅ **Flexible Cleanup** - Pilih tipe dan periode cleanup  
✅ **Safe Operation** - Konfirmasi sebelum hapus  
✅ **Database Optimization** - Reclaim space & improve performance  
✅ **Audit Trail** - Log semua aksi cleanup  
✅ **Access Control** - Hanya admin yang bisa akses  

**Status:** ✅ **READY TO USE** 🎉

**Action Required:**
1. ✅ Copy file `backend-routes-cleanup.js` ke backend
2. ✅ Register route di `server.js`
3. ✅ Restart backend
4. ✅ Test fitur cleanup di dashboard

**Expected Result:**
- Admin bisa cleanup data lama
- Database size berkurang
- Performa aplikasi meningkat
- Disk space reclaimed
