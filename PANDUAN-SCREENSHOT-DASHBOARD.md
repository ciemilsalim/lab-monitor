# 📸 Panduan Lengkap: Fitur Screenshot di Dashboard

## 🎯 Overview

Fitur screenshot memungkinkan admin/guru untuk **melihat layar komputer siswa secara real-time** langsung dari dashboard admin, tanpa harus datang ke komputer siswa.

---

## 🚀 Cara Menggunakan

### **Langkah 1: Buka Dashboard Admin**

```
http://localhost:3000
```

Login dengan akun admin/guru.

---

### **Langkah 2: Pilih Komputer Siswa**

1. Klik menu **"Komputer"** di sidebar
2. Klik komputer yang ingin dilihat layarnya (misal: PC-13)
3. Panel detail komputer akan muncul

---

### **Langkah 3: Request Screenshot**

**Option A: Via Tab "Kontrol"**

1. Di panel detail komputer, klik tab **"Kontrol"**
2. Klik tombol **"Lihat Layar"** (icon mata 👁️)
3. Tunggu 2-5 detik

**Option B: Via Remote Desktop Control**

1. Klik tombol **"🎮 Remote Desktop Control"**
2. Klik tombol **"Screenshot"** di toolbar

---

### **Langkah 4: Lihat Screenshot**

Setelah screenshot berhasil diambil, modal akan muncul otomatis dengan:

- ✅ **Gambar screenshot** layar komputer siswa
- ✅ **Info komputer** (nama, IP address)
- ✅ **Info siswa** (nama siswa)
- ✅ **Timestamp** (waktu screenshot diambil)
- ✅ **Ukuran file** (dalam KB)

---

### **Langkah 5: Interaksi dengan Screenshot**

Di modal screenshot, Anda bisa:

**📥 Download Screenshot**
- Klik tombol **Download** (icon download ⬇️)
- File PNG akan terdownload ke folder Downloads
- Nama file: `screenshot-PC-13-[timestamp].png`

**🖥️ Fullscreen Mode**
- Klik tombol **Fullscreen** (icon maximize ⛶)
- Screenshot tampil fullscreen
- Klik lagi untuk minimize

**❌ Close Modal**
- Klik tombol **Close** (icon X)
- Atau klik di luar modal

---

## 🔄 Alur Kerja

```
┌─────────────────────────────────────────────────────────┐
│ 1. Admin klik "Lihat Layar" di dashboard               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend emit 'request-screenshot' via Socket.io    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Backend terima & broadcast ke agent                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Agent di PC siswa ambil screenshot                  │
│    - Capture layar menggunakan PowerShell               │
│    - Convert ke base64                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Agent emit 'screenshot-captured' ke backend         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Backend broadcast ke frontend                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Frontend terima & tampilkan di modal                │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Fitur yang Tersedia

### **✅ Sudah Diimplementasi:**

- ✅ **Real-time screenshot** - Lihat layar siswa secara langsung
- ✅ **Download screenshot** - Simpan screenshot ke komputer admin
- ✅ **Fullscreen mode** - Lihat screenshot dalam layar penuh
- ✅ **Info lengkap** - Nama komputer, siswa, timestamp, ukuran
- ✅ **Loading state** - Animasi loading saat screenshot diambil
- ✅ **Error handling** - Pesan error jika screenshot gagal
- ✅ **History** - Simpan history screenshot terakhir (50 screenshot)

### **🚀 Fitur Selanjutnya (Coming Soon):**

- ⏳ **Auto-refresh** - Screenshot otomatis refresh setiap 5 detik
- ⏳ **Screenshot gallery** - Lihat semua screenshot per komputer
- ⏳ **Batch screenshot** - Ambil screenshot semua komputer sekaligus
- ⏳ **Scheduled screenshot** - Ambil screenshot otomatis setiap X menit
- ⏳ **Annotation** - Tambah catatan/gambar di screenshot
- ⏳ **Image compression** - Kurangi ukuran file screenshot

---

## 🎨 Tampilan UI

### **Modal Screenshot:**

```
┌─────────────────────────────────────────────────────────┐
│  [Monitor] Komputer 13                        [⬇️][⛶][❌]│
│           👤 Siswa Lab 13  🕐 08/10/2026 12:00:00      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│              [GAMBAR SCREENSHOT]                        │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  🖥️ PC-13    📦 Ukuran: 1,234.56 KB    [Live Screenshot]│
└─────────────────────────────────────────────────────────┘
```

### **Tombol di Panel Kontrol:**

```
┌─────────────────────────────────────────────────────────┐
│  Panel Kontrol Remote                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [🎮 Remote Desktop Control]                           │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ ⏹️       │ │ 🔄       │ │ 🔒       │               │
│  │ Shutdown │ │ Restart  │ │ Lock     │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 👁️       │ │ 💬       │ │ 🚫       │               │
│  │ Lihat    │ │ Kirim    │ │ Blokir   │               │
│  │ Layar    │ │ Pesan    │ │ Internet │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### **Problem: Screenshot tidak muncul**

**Gejala:**
- Klik "Lihat Layar" tapi tidak ada screenshot muncul
- Loading terus-menerus

**Solusi:**

**Cek 1: Agent Running?**
```cmd
# Di PC-13
tasklist | findstr node

# Harus ada: node.exe
```

**Cek 2: Agent Log**
```cmd
# Di PC-13
type C:\labmonitor-agent\logs\agent.log

# Cari: "📸 Screenshot request received"
```

**Cek 3: Backend Log**
```
# Di terminal backend
📸 Screenshot request received for: PC-13
📸 Screenshot captured from: PC-13
```

**Cek 4: Browser Console**
```
# Tekan F12 → Tab Console
📸 Requesting screenshot from: PC-13
📸 Screenshot captured: PC-13
```

---

### **Problem: Screenshot gagal diambil**

**Gejala:**
- Error: "Failed to take screenshot"
- Screenshot tidak muncul

**Penyebab:**
- Agent tidak running sebagai Administrator
- PowerShell script error

**Solusi:**

**Option 1: Run Agent sebagai Administrator**
```cmd
# Di PC-13
# Stop agent (Ctrl+C)

# Run sebagai Administrator
# Right-click Command Prompt → Run as Administrator

cd C:\labmonitor-agent
npm start
```

**Option 2: Install sebagai Windows Service**
```cmd
# Di PC-13
cd C:\labmonitor-agent
npm run install-service
```

---

### **Problem: Screenshot terlalu besar**

**Gejala:**
- Screenshot muncul tapi sangat lambat
- Ukuran file > 5 MB

**Penyebab:**
- Resolusi layar tinggi (4K, etc)
- Tidak ada kompresi

**Solusi:**

**Temporary:**
- Tunggu sampai screenshot selesai dimuat
- Download screenshot untuk lihat offline

**Permanent (Coming Soon):**
- Implementasi image compression di agent
- Reduce kualitas gambar
- Resize gambar sebelum kirim

---

## 📋 Checklist Penggunaan

### **Sebelum Menggunakan:**

- [ ] Backend running di server (`npm run dev`)
- [ ] Frontend running di server (`npm run dev`)
- [ ] Agent running di PC siswa (sebagai Administrator)
- [ ] Socket.io connected (cek indicator "Live" di header)
- [ ] Database MySQL running (via Laragon)

### **Saat Menggunakan:**

- [ ] Pilih komputer yang statusnya "Online"
- [ ] Klik "Lihat Layar" di tab "Kontrol"
- [ ] Tunggu 2-5 detik untuk screenshot
- [ ] Screenshot muncul di modal
- [ ] Download atau fullscreen sesuai kebutuhan

### **Setelah Menggunakan:**

- [ ] Close modal screenshot
- [ ] Cek history screenshot di state (jika perlu)
- [ ] Lanjut monitoring komputer lain

---

## 🎯 Use Cases

### **Use Case 1: Monitoring Ujian**

**Scenario:** Guru ingin mengawasi siswa saat ujian online

**Langkah:**
1. Buka dashboard admin
2. Pilih komputer siswa satu per satu
3. Klik "Lihat Layar" untuk setiap siswa
4. Lihat apakah siswa membuka tab yang tidak diizinkan
5. Download screenshot sebagai bukti

**Benefit:**
- ✅ Mengawasi semua siswa dari satu tempat
- ✅ Tidak perlu berkeliling kelas
- ✅ Bukti screenshot bisa disimpan

---

### **Use Case 2: Troubleshooting Komputer Siswa**

**Scenario:** Siswa melaporkan masalah di komputernya

**Langkah:**
1. Siswa bilang: "Pak, komputer saya error"
2. Admin klik komputer siswa
3. Klik "Lihat Layar"
4. Lihat error message di screenshot
5. Berikan solusi berdasarkan screenshot

**Benefit:**
- ✅ Diagnosa masalah lebih cepat
- ✅ Lihat error message secara langsung
- ✅ Tidak perlu datang ke komputer siswa

---

### **Use Case 3: Verifikasi Aktivitas Siswa**

**Scenario:** Guru ingin memastikan siswa mengerjakan tugas

**Langkah:**
1. Buka dashboard admin
2. Pilih komputer siswa
3. Klik "Lihat Layar"
4. Lihat apakah siswa membuka aplikasi yang sesuai
5. Download screenshot sebagai dokumentasi

**Benefit:**
- ✅ Verifikasi aktivitas siswa
- ✅ Pastikan siswa tidak bermain game/sosmed
- ✅ Dokumentasi aktivitas siswa

---

## 📊 Statistik & Analytics

### **Data yang Tersedia:**

- **Total screenshot** yang diambil
- **Screenshot per komputer** - berapa kali screenshot diambil per komputer
- **Screenshot per siswa** - berapa kali screenshot diambil per siswa
- **Waktu rata-rata** - berapa lama waktu untuk ambil screenshot
- **Ukuran rata-rata** - ukuran file screenshot rata-rata

### **Cara Akses:**

```javascript
// Di Browser Console (F12)
// Lihat history screenshot
console.log(window.screenshots);

// Lihat screenshot terakhir
console.log(window.currentScreenshot);
```

---

## 🔒 Security & Privacy

### **Privacy Notice:**

⚠️ **PENTING:** Fitur screenshot mengambil gambar layar komputer siswa. Pastikan:

1. ✅ **Informasikan kepada siswa** bahwa layar mereka bisa dimonitor
2. ✅ **Gunakan untuk tujuan edukasi** saja
3. ✅ **Simpan screenshot dengan aman** - jangan share ke pihak tidak berwenang
4. ✅ **Hapus screenshot** setelah tidak diperlukan
5. ✅ **Patuhi regulasi privasi** yang berlaku di sekolah/institusi

### **Security:**

- ✅ Screenshot dikirim via **encrypted Socket.io**
- ✅ Screenshot **tidak disimpan di server** (hanya di memory)
- ✅ Screenshot **hanya bisa dilihat oleh admin** yang login
- ✅ Screenshot **tidak bisa diakses dari luar** jaringan lokal

---

## 📞 Support & Documentation

### **Dokumentasi Lengkap:**

- `BACKEND-SCREENSHOT-INTEGRATION.md` - Implementasi backend
- `TROUBLESHOOTING-SCREENSHOT.md` - Troubleshooting guide
- `agent/TROUBLESHOOTING-REMOTE.md` - Troubleshooting agent

### **Support:**

Jika ada masalah atau pertanyaan:
1. Cek log backend, agent, dan browser console
2. Baca dokumentasi troubleshooting
3. Hubungi tim developer

---

## ✅ Summary

**Fitur screenshot di dashboard admin memungkinkan:**

✅ **Real-time monitoring** - Lihat layar siswa secara langsung  
✅ **Download screenshot** - Simpan screenshot untuk dokumentasi  
✅ **Fullscreen mode** - Lihat screenshot dalam layar penuh  
✅ **Easy to use** - Cukup klik "Lihat Layar"  
✅ **Fast** - Screenshot muncul dalam 2-5 detik  
✅ **Secure** - Hanya admin yang bisa akses  

**Status: ✅ READY TO USE** 🎉

**Mulai gunakan sekarang untuk monitoring kelas yang lebih efektif!**
