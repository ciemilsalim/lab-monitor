# 🎯 START HERE - Deploy Backend dalam 5 Menit!

## 👋 Selamat Datang!

Folder ini berisi **Backend Server LabMonitor** yang siap deploy. Tinggal copy-paste dan jalankan!

---

## 🚀 QUICK START (3 Langkah)

### **1️⃣ Copy Folder**

```bash
copy agent\backend D:\labmonitor-backend /E /I /Y
```

**Atau manual:**
- Copy semua isi folder `agent/backend/`
- Paste ke `D:\labmonitor-backend\`
- Replace semua file

---

### **2️⃣ Install & Setup**

```bash
cd D:\labmonitor-backend
npm install
copy .env.example .env
notepad .env
```

**Edit `.env`:**
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=labmonitor
JWT_SECRET=ganti-dengan-random-string
CORS_ORIGIN=http://localhost:3000
```

**Save** (Ctrl+S)

---

### **3️⃣ Setup Database & Start**

```bash
# Buka phpMyAdmin
start http://localhost/phpmyadmin

# Import database
# Klik tab "SQL" → Paste isi file database/schema.sql → Klik "Go"

# Start backend
npm run dev
```

**Expected:**
```
🚀 LabMonitor Backend Server v1.3
✅ Alert Engine ENABLED
✅ Real-time alerts ENABLED
```

---

## ✅ DONE!

Backend sudah berjalan di: **http://localhost:3001**

**Test:**
```bash
curl http://localhost:3001/health
```

---

## 📚 Dokumentasi Lengkap

| File | Deskripsi |
|------|-----------|
| **QUICK-DEPLOY.md** | Panduan copy-paste detail |
| **VISUAL-GUIDE.md** | Panduan visual dengan diagram |
| **README.md** | Dokumentasi lengkap API & fitur |

---

## 🆘 Butuh Bantuan?

1. Baca **QUICK-DEPLOY.md** untuk langkah detail
2. Baca **VISUAL-GUIDE.md** untuk panduan visual
3. Baca **README.md** untuk dokumentasi lengkap

---

## 📋 Checklist

- [ ] Copy folder backend
- [ ] Run `npm install`
- [ ] Setup `.env`
- [ ] Import database schema
- [ ] Run `npm run dev`
- [ ] Test health check

---

**Status:** ✅ **READY TO DEPLOY** 🚀

**Developer:** zahradev  
**Version:** 1.3
