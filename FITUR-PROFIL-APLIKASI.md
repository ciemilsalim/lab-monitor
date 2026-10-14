# 🏫 Fitur Setting Profil Aplikasi

## 📋 Overview

Fitur **Setting Profil Aplikasi** memungkinkan admin untuk mengkonfigurasi data sekolah yang akan digunakan pada KOP surat di laporan PDF monitoring lab komputer.

---

## ✨ Fitur Utama

### **1. Informasi Sekolah**
- ✅ Nama sekolah
- ✅ Alamat sekolah
- ✅ Nomor telepon
- ✅ Email sekolah
- ✅ Kota/Kabupaten
- ✅ Provinsi

### **2. Logo Sekolah**
- ✅ Upload logo sekolah (PNG, JPG, JPEG)
- ✅ Preview logo real-time
- ✅ Logo otomatis muncul di KOP surat PDF
- ✅ Maksimal 2MB, rekomendasi 200x200px

### **3. Penanggung Jawab Laboratorium**
- ✅ Nama lengkap penanggung jawab
- ✅ NIP (Nomor Induk Pegawai)
- ✅ Jabatan (default: Kepala Laboratorium)

### **4. Preview KOP Surat**
- ✅ Preview real-time KOP surat
- ✅ Tampilan logo, nama sekolah, alamat
- ✅ Tampilan penanggung jawab dengan NIP
- ✅ Update otomatis saat data diubah

---

## 🚀 Setup Database

### **Step 1: Create Tabel app_profile**

Jalankan SQL berikut di phpMyAdmin:

```sql
-- ========================================
-- TABEL: app_profile (untuk profil aplikasi)
-- ========================================
CREATE TABLE IF NOT EXISTS app_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_name VARCHAR(255) NOT NULL,
  school_address TEXT,
  school_phone VARCHAR(50),
  school_email VARCHAR(100),
  lab_head_name VARCHAR(255) NOT NULL,
  lab_head_nip VARCHAR(50),
  lab_head_position VARCHAR(100) DEFAULT 'Kepala Laboratorium',
  logo_url TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Step 2: Import Schema Lengkap (Optional)**

Jika ingin import semua tabel sekaligus:

```bash
# Buka phpMyAdmin
http://localhost/phpmyadmin

# Pilih database: labmonitor
# Klik tab "Import"
# Upload file: agent/backend/database/schema.sql
```

---

## 🔧 Setup Backend

### **Step 1: Copy File Route**

```bash
# Copy file profile.js ke backend
copy agent\backend\src\routes\profile.js D:\labmonitor-backend\src\routes\profile.js /Y
```

### **Step 2: Register Route di server.js**

File: `D:\labmonitor-backend\src\server.js`

Tambahkan baris berikut di bagian API ROUTES:

```javascript
app.use('/api/profile', require('./routes/profile'));
```

**Lokasi:** Setelah baris `app.use('/api/reports', require('./routes/reports'));`

### **Step 3: Restart Backend**

```bash
cd D:\labmonitor-backend
npm run dev
```

---

## 🎨 Setup Frontend

### **Step 1: Copy File Component**

```bash
# Copy file ProfileSettings.tsx ke frontend
copy src\components\ProfileSettings.tsx D:\labmonitor-frontend\src\components\ProfileSettings.tsx /Y
```

### **Step 2: Update Types**

File: `D:\labmonitor-frontend\src\types.ts`

Tambahkan interface `AppProfile`:

```typescript
export interface AppProfile {
  id: number;
  school_name: string;
  school_address: string;
  school_phone: string;
  school_email: string;
  lab_head_name: string;
  lab_head_nip: string;
  lab_head_position: string;
  logo_url: string;
  city: string;
  province: string;
  updated_at: string;
}
```

Tambahkan `'profile'` ke `ViewMode`:

```typescript
export type ViewMode = 'dashboard' | 'computers' | 'activity' | 'alerts' | 'network' | 'guide' | 'cleanup' | 'reports' | 'profile';
```

### **Step 3: Update Sidebar**

File: `D:\labmonitor-frontend\src\components\Sidebar.tsx`

Tambahkan import:

```typescript
import { Monitor, LayoutDashboard, Globe, AlertTriangle, Network, Activity, BookOpen, Trash2, FileText, Settings } from 'lucide-react';
```

Tambahkan menu item:

```typescript
const menuItems = [
  // ... existing items
  { id: 'profile' as ViewMode, label: 'Profil', icon: Settings },
  { id: 'guide' as ViewMode, label: 'Panduan', icon: BookOpen },
];
```

### **Step 4: Update App.tsx**

File: `D:\labmonitor-frontend\src\App.tsx`

Tambahkan import:

```typescript
import ProfileSettings from './components/ProfileSettings';
```

Tambahkan route:

```typescript
case 'profile':
  return <ProfileSettings />;
```

### **Step 5: Restart Frontend**

```bash
cd D:\labmonitor-frontend
npm run dev
```

---

## 📊 Cara Menggunakan

### **Step 1: Akses Menu Profil**

1. Login ke dashboard admin
2. Klik menu **"Profil"** di sidebar (icon ⚙️)
3. Halaman Setting Profil akan terbuka

### **Step 2: Upload Logo Sekolah**

1. Klik tombol **"Pilih file logo"**
2. Pilih file logo sekolah (PNG, JPG, JPEG)
3. Preview logo akan muncul otomatis
4. **Tips:** Gunakan logo dengan resolusi 200x200px untuk hasil terbaik

### **Step 3: Isi Informasi Sekolah**

1. **Nama Sekolah** - Contoh: SMA Negeri 1 Jakarta
2. **Alamat Sekolah** - Contoh: Jl. Pendidikan No. 123, Jakarta Pusat
3. **Kota/Kabupaten** - Contoh: Jakarta
4. **Provinsi** - Contoh: DKI Jakarta
5. **Telepon** - Contoh: (021) 1234-5678
6. **Email** - Contoh: info@sman1jakarta.sch.id

### **Step 4: Isi Data Penanggung Jawab**

1. **Nama Lengkap** - Contoh: Budi Santoso, S.Pd
2. **NIP** - Contoh: 196801011990031001
3. **Jabatan** - Default: Kepala Laboratorium

### **Step 5: Preview KOP Surat**

1. Scroll ke bagian **"Preview KOP Surat"**
2. Lihat preview KOP surat dengan data yang sudah diisi
3. Pastikan semua data sudah benar

### **Step 6: Simpan Profil**

1. Klik tombol **"Simpan Profil"**
2. Tunggu notifikasi "Profil berhasil disimpan!"
3. Data profil sekarang tersimpan di database

---

## 📄 Integrasi dengan Laporan PDF

### **Otomatis Digunakan di Laporan**

Setelah profil disimpan, data akan otomatis digunakan di:

1. **KOP Surat PDF**
   - Logo sekolah
   - Nama sekolah
   - Alamat sekolah
   - Telepon & email

2. **Footer Laporan**
   - Kota dan tanggal
   - Jabatan penanggung jawab
   - Nama penanggung jawab
   - NIP

### **Cara Test:**

1. Buka menu **"Laporan"**
2. Pilih periode laporan
3. Klik **"Ambil Data Laporan"**
4. Klik **"Download PDF"**
5. Buka PDF yang didownload
6. **Expected:** KOP surat menampilkan data profil yang sudah diisi

---

## 🔍 Troubleshooting

### **Problem: Logo tidak muncul di PDF**

**Penyebab:**
- File logo terlalu besar (> 2MB)
- Format logo tidak didukung
- Data profil belum tersimpan

**Solusi:**
1. Compress logo ke ukuran < 2MB
2. Gunakan format PNG atau JPG
3. Pastikan klik "Simpan Profil" setelah upload logo

---

### **Problem: Data profil tidak muncul di PDF**

**Penyebab:**
- Data profil belum diisi
- Backend belum restart setelah update
- Database tabel app_profile belum dibuat

**Solusi:**
1. Isi semua data profil di menu "Profil"
2. Restart backend: `npm run dev`
3. Check database: `SELECT * FROM app_profile;`

---

### **Problem: Error saat save profil**

**Penyebab:**
- Tabel app_profile belum dibuat
- Backend route belum di-register
- Database connection error

**Solusi:**
1. Import SQL schema untuk tabel app_profile
2. Check server.js sudah ada `app.use('/api/profile', ...)`
3. Check backend log untuk error detail

---

## 📋 API Endpoints

### **GET /api/profile**

Get profil aplikasi

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "school_name": "SMA Negeri 1 Jakarta",
    "school_address": "Jl. Pendidikan No. 123",
    "school_phone": "(021) 1234-5678",
    "school_email": "info@sman1jakarta.sch.id",
    "lab_head_name": "Budi Santoso, S.Pd",
    "lab_head_nip": "196801011990031001",
    "lab_head_position": "Kepala Laboratorium",
    "logo_url": "data:image/png;base64,...",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "updated_at": "2026-10-08T12:00:00.000Z"
  }
}
```

### **PUT /api/profile**

Update profil aplikasi

**Request Body:**
```json
{
  "school_name": "SMA Negeri 1 Jakarta",
  "school_address": "Jl. Pendidikan No. 123",
  "school_phone": "(021) 1234-5678",
  "school_email": "info@sman1jakarta.sch.id",
  "lab_head_name": "Budi Santoso, S.Pd",
  "lab_head_nip": "196801011990031001",
  "lab_head_position": "Kepala Laboratorium",
  "logo_url": "data:image/png;base64,...",
  "city": "Jakarta",
  "province": "DKI Jakarta"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 🎨 Preview KOP Surat

### **Struktur KOP:**

```
┌─────────────────────────────────────────┐
│  [LOGO]  PEMERINTAH DAERAH              │
│          DINAS PENDIDIKAN               │
│          SMA NEGERI 1 JAKARTA           │
│          Jl. Pendidikan No. 123         │
│          Telp: (021) 1234-5678          │
│          Email: info@sman1jakarta...    │
│  ═══════════════════════════════════    │
└─────────────────────────────────────────┘
```

### **Struktur Footer:**

```
          Jakarta, 8 Oktober 2026
          Kepala Laboratorium
          
          
          Budi Santoso, S.Pd
          NIP. 196801011990031001
```

---

## 📊 Data yang Disimpan

| Field | Tipe | Deskripsi |
|-------|------|-----------|
| `school_name` | VARCHAR(255) | Nama sekolah |
| `school_address` | TEXT | Alamat lengkap sekolah |
| `school_phone` | VARCHAR(50) | Nomor telepon sekolah |
| `school_email` | VARCHAR(100) | Email sekolah |
| `lab_head_name` | VARCHAR(255) | Nama penanggung jawab lab |
| `lab_head_nip` | VARCHAR(50) | NIP penanggung jawab |
| `lab_head_position` | VARCHAR(100) | Jabatan penanggung jawab |
| `logo_url` | TEXT | Base64 encoded logo |
| `city` | VARCHAR(100) | Kota/Kabupaten |
| `province` | VARCHAR(100) | Provinsi |

---

## ✅ Checklist Setup

### **Database:**
- [ ] Tabel `app_profile` sudah dibuat
- [ ] Import schema.sql (optional)

### **Backend:**
- [ ] File `profile.js` sudah di-copy ke `src/routes/`
- [ ] Route `/api/profile` sudah di-register di `server.js`
- [ ] Backend sudah restart

### **Frontend:**
- [ ] File `ProfileSettings.tsx` sudah di-copy
- [ ] Interface `AppProfile` sudah ditambahkan di `types.ts`
- [ ] Menu "Profil" sudah ditambahkan di `Sidebar.tsx`
- [ ] Route `profile` sudah ditambahkan di `App.tsx`
- [ ] Frontend sudah restart

### **Testing:**
- [ ] Menu "Profil" muncul di sidebar
- [ ] Bisa upload logo
- [ ] Bisa isi data sekolah
- [ ] Bisa isi data penanggung jawab
- [ ] Preview KOP surat muncul
- [ ] Data tersimpan setelah klik "Simpan"
- [ ] Data profil muncul di laporan PDF

---

## 🎯 Use Cases

### **Use Case 1: Setup Awal**

**Scenario:** Admin baru menginstall LabMonitor

**Langkah:**
1. Buat tabel `app_profile` di database
2. Copy file backend & frontend
3. Restart backend & frontend
4. Buka menu "Profil"
5. Isi data sekolah lengkap
6. Upload logo sekolah
7. Isi data penanggung jawab
8. Klik "Simpan Profil"

**Result:**
- ✅ Profil tersimpan di database
- ✅ KOP surat PDF menggunakan data profil
- ✅ Footer laporan menggunakan data penanggung jawab

### **Use Case 2: Update Data**

**Scenario:** Ada perubahan data sekolah

**Langkah:**
1. Buka menu "Profil"
2. Update data yang berubah
3. Upload logo baru (jika ada)
4. Klik "Simpan Profil"
5. Test download laporan PDF

**Result:**
- ✅ Data profil terupdate
- ✅ Laporan PDF berikutnya menggunakan data baru

### **Use Case 3: Ganti Penanggung Jawab**

**Scenario:** Penanggung jawab lab berganti

**Langkah:**
1. Buka menu "Profil"
2. Update nama penanggung jawab
3. Update NIP
4. Update jabatan (jika perlu)
5. Klik "Simpan Profil"

**Result:**
- ✅ Data penanggung jawab terupdate
- ✅ Footer laporan PDF menggunakan data baru

---

## 📞 Support

### **Dokumentasi:**
- `LAPORAN-PDF-FEATURE.md` - Dokumentasi fitur laporan PDF
- `FITUR-PROFIL-APLIKASI.md` - Dokumentasi ini

### **Files Terkait:**

**Backend:**
- `agent/backend/src/routes/profile.js` - API endpoint
- `agent/backend/database/schema.sql` - Database schema
- `agent/backend/database/app_profile.sql` - Schema terpisah

**Frontend:**
- `src/components/ProfileSettings.tsx` - UI component
- `src/components/ReportGenerator.tsx` - Integrasi dengan PDF
- `src/types.ts` - Type definitions
- `src/components/Sidebar.tsx` - Menu integration
- `src/App.tsx` - Route integration

---

## ✅ Status

**Build Status:** ✅ **SUCCESS**

**Files Created:**
- ✅ `src/components/ProfileSettings.tsx` - Frontend component
- ✅ `agent/backend/src/routes/profile.js` - Backend API
- ✅ `agent/backend/database/app_profile.sql` - Database schema
- ✅ `FITUR-PROFIL-APLIKASI.md` - Dokumentasi ini

**Files Updated:**
- ✅ `src/types.ts` - Tambah AppProfile interface
- ✅ `src/components/Sidebar.tsx` - Tambah menu Profil
- ✅ `src/App.tsx` - Tambah route profile
- ✅ `src/components/ReportGenerator.tsx` - Integrasi profil data
- ✅ `agent/backend/src/server.js` - Register profile route
- ✅ `agent/backend/src/routes/reports.js` - Include profil di response
- ✅ `agent/backend/database/schema.sql` - Tambah tabel app_profile

**Status:** ✅ **READY TO USE** 🎉

---

## 🎉 Summary

Fitur **Setting Profil Aplikasi** sudah siap digunakan!

**Fitur yang tersedia:**
- ✅ Upload logo sekolah
- ✅ Konfigurasi data sekolah
- ✅ Konfigurasi data penanggung jawab
- ✅ Preview KOP surat real-time
- ✅ Integrasi otomatis dengan laporan PDF
- ✅ Data tersimpan di database

**Action Required:**
1. ✅ Create tabel `app_profile` di database
2. ✅ Copy file backend & frontend
3. ✅ Restart backend & frontend
4. ✅ Isi data profil di menu "Profil"
5. ✅ Test download laporan PDF

**Expected Result:**
- ✅ KOP surat PDF menggunakan data profil
- ✅ Footer laporan menggunakan data penanggung jawab
- ✅ Logo sekolah muncul di KOP surat
- ✅ Data dinamis, bisa diupdate kapan saja

**Status:** ✅ **READY TO USE** 🚀
