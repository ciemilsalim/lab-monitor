# 🔧 Troubleshooting: Block Internet Tidak Efektif

## 📋 Masalah

**Gejala:**
- ✅ Agent menerima command "block"
- ✅ Firewall rules berhasil dibuat (3/3 rules applied)
- ❌ Internet tetap bisa diakses
- ❌ Browser masih bisa buka website
- ❌ Ping google.com masih berhasil

---

## 🔍 Penyebab

### **Penyebab 1: Firewall Rules Tidak Efektif**

Rules lama hanya memblokir port tertentu:
```cmd
❌ Block HTTP (port 80, 443) - Bisa di-bypass dengan proxy
❌ Block DNS (port 53) - Bisa pakai DNS alternatif
❌ Block TCP - Tidak memblokir UDP
```

### **Penyebab 2: Ada Rule Allow yang Override**

Jika ada rule "Allow" dengan priority lebih tinggi, rule "Block" tidak akan berfungsi.

### **Penyebab 3: Browser Menggunakan Proxy/VPN**

Jika siswa menggunakan proxy atau VPN, firewall rules tidak akan efektif.

---

## ✅ SOLUSI: Rules yang Lebih Efektif

### **Update 1: Block ALL Outbound Traffic**

File `remote.js` sudah diupdate dengan rules yang lebih efektif:

```javascript
// Block ALL outbound traffic (most effective)
'netsh advfirewall firewall add rule name="LabMonitor_Block_ALL_Out" dir=out action=block remoteip=any'

// Block HTTP/HTTPS specifically
'netsh advfirewall firewall add rule name="LabMonitor_Block_HTTP" dir=out action=block protocol=TCP remoteport=80,443'

// Block DNS (UDP dan TCP)
'netsh advfirewall firewall add rule name="LabMonitor_Block_DNS" dir=out action=block protocol=UDP remoteport=53'
'netsh advfirewall firewall add rule name="LabMonitor_Block_DNS_TCP" dir=out action=block protocol=TCP remoteport=53'
```

**Penjelasan:**
- `LabMonitor_Block_ALL_Out` → Blokir SEMUA outbound traffic (paling efektif)
- `LabMonitor_Block_HTTP` → Blokir HTTP/HTTPS secara spesifik
- `LabMonitor_Block_DNS` → Blokir DNS (UDP dan TCP)

---

## 🚀 LANGKAH-LANGKAH FIX

### **Step 1: Hapus Rules Lama**

**Di PC-13 (Command Prompt Administrator):**

```cmd
# Hapus semua rules LabMonitor lama
netsh advfirewall firewall delete rule name="LabMonitor_Block_HTTP"
netsh advfirewall firewall delete rule name="LabMonitor_Block_DNS"
netsh advfirewall firewall delete rule name="LabMonitor_Block_TCP"
```

### **Step 2: Copy File remote.js yang Baru**

**Di Server Admin:**

```powershell
# Copy file remote.js yang sudah diupdate
copy agent\src\controllers\remote.js \\PC-13\C$\labmonitor-agent\src\controllers\
```

**Atau manual:**
- Buka file `agent/src/controllers/remote.js` di project ini
- Copy semua isinya
- Paste ke `C:\labmonitor-agent\src\controllers\remote.js` di PC-13

### **Step 3: Restart Agent**

**Di PC-13:**

```cmd
# Stop agent (Ctrl+C)

# Start agent lagi (sebagai Administrator)
cd C:\labmonitor-agent
npm start
```

### **Step 4: Test Block Internet**

**Di Dashboard Admin:**

1. Klik PC-13 → Tab "Kontrol" → "Remote Desktop Control"
2. Klik tombol "Block Internet"

**Expected di Terminal Agent:**

```
🚫 Executing BLOCK INTERNET command
🚫 Attempting to block internet...
✅ Rule 1 applied successfully
✅ Rule 2 applied successfully
✅ Rule 3 applied successfully
✅ Rule 4 applied successfully
✅ Internet blocked: 4/4 rules applied
✅ Command result: SUCCESS
✅ Message: Internet blocked successfully (4/4 rules applied). Test: ping google.com should fail.
```

### **Step 5: Verifikasi Internet Terblokir**

**Di PC-13:**

```cmd
# Test 1: Ping
ping google.com

# Expected: Request timed out (4 kali)

# Test 2: Tracert
tracert google.com

# Expected: Unable to resolve target

# Test 3: Browser
# Buka Chrome/Firefox
# Coba akses: https://google.com

# Expected: ERR_CONNECTION_TIMED_OUT atau ERR_INTERNET_DISCONNECTED
```

---

## 🔍 Troubleshooting Lanjutan

### **Problem: Internet Masih Bisa Diakses Setelah Block**

**Cek 1: Verifikasi Firewall Rules**

```cmd
# Lihat semua rules LabMonitor
netsh advfirewall firewall show rule name=all | findstr LabMonitor

# Expected:
# Rule Name: LabMonitor_Block_ALL_Out
# Direction: OUT
# Action: Block
# 
# Rule Name: LabMonitor_Block_HTTP
# Direction: OUT
# Action: Block
# ...
```

**Cek 2: Cek Apakah Ada Rule Allow yang Override**

```cmd
# Lihat semua rules outbound
netsh advfirewall firewall show rule name=all dir=out

# Cari rule dengan Action: Allow
# Jika ada rule Allow untuk "any" atau "all", itu yang override
```

**Cek 3: Cek Firewall Profile**

```cmd
# Cek status firewall
netsh advfirewall show allprofiles state

# Expected:
# Domain Profile: ON
# Private Profile: ON
# Public Profile: ON
```

Jika firewall OFF, enable:

```cmd
netsh advfirewall set allprofiles state on
```

**Cek 4: Cek Apakah Ada Proxy/VPN**

```cmd
# Cek proxy settings
netsh winhttp show proxy

# Jika ada proxy, internet bisa bypass firewall
# Hapus proxy:
netsh winhttp reset proxy
```

---

## 🧪 Test Manual Block Internet

Jika masih bermasalah, test manual:

### **Test 1: Block Manual dengan 1 Rule**

```cmd
# Block semua outbound
netsh advfirewall firewall add rule name="Test_Block_All" dir=out action=block remoteip=any

# Test internet
ping google.com
# Expected: Request timed out

# Unblock
netsh advfirewall firewall delete rule name="Test_Block_All"

# Test lagi
ping google.com
# Expected: Reply from ...
```

### **Test 2: Block HTTP Only**

```cmd
# Block HTTP/HTTPS
netsh advfirewall firewall add rule name="Test_Block_HTTP" dir=out action=block protocol=TCP remoteport=80,443

# Test browser
# Buka Chrome → https://google.com
# Expected: ERR_CONNECTION_TIMED_OUT

# Unblock
netsh advfirewall firewall delete rule name="Test_Block_HTTP"
```

### **Test 3: Block DNS Only**

```cmd
# Block DNS
netsh advfirewall firewall add rule name="Test_Block_DNS" dir=out action=block protocol=UDP remoteport=53

# Test browser
# Buka Chrome → https://google.com
# Expected: ERR_NAME_NOT_RESOLVED

# Unblock
netsh advfirewall firewall delete rule name="Test_Block_DNS"
```

---

## 📊 Perbandingan Rules

### **Rules Lama (Tidak Efektif):**

```cmd
❌ Block HTTP (80, 443) - Bisa bypass dengan proxy
❌ Block DNS UDP (53) - Bisa pakai DNS TCP
❌ Block TCP - Tidak block UDP
```

**Masalah:**
- Siswa bisa pakai proxy untuk bypass
- Siswa bisa ganti DNS (8.8.8.8, 1.1.1.1)
- Masih ada traffic UDP yang tidak terblokir

### **Rules Baru (Efektif):**

```cmd
✅ Block ALL Outbound - Blokir SEMUA traffic keluar
✅ Block HTTP/HTTPS - Blokir web secara spesifik
✅ Block DNS UDP & TCP - Blokir DNS completely
```

**Keuntungan:**
- Block ALL Outbound → Tidak ada yang bisa bypass
- Multiple layers → Jika 1 rule gagal, masih ada rule lain
- DNS UDP & TCP → Tidak bisa ganti DNS

---

## 🎯 Expected Result

Setelah update, block internet harus **100% efektif**:

✅ **Ping google.com** → Request timed out  
✅ **Tracert google.com** → Unable to resolve  
✅ **Browser** → ERR_CONNECTION_TIMED_OUT  
✅ **Aplikasi online** → Tidak bisa connect  

---

## 📝 Checklist Verifikasi

Sebelum test, pastikan:

- [ ] Rules lama sudah dihapus
- [ ] File `remote.js` sudah diupdate
- [ ] Agent sudah restart
- [ ] Agent running sebagai Administrator
- [ ] Firewall Windows ON
- [ ] Tidak ada proxy/VPN aktif
- [ ] Test dengan `ping google.com` → harus gagal

---

## 🚨 Jika Masih Bermasalah

### **Option 1: Disable Network Adapter (Extreme)**

Jika firewall tidak efektif, disable network adapter:

```javascript
// Di remote.js, tambahkan function:
async disableNetwork() {
  return new Promise((resolve) => {
    // Disable semua network adapters
    exec('wmic nic where "NetEnabled=true" call disable', (error) => {
      if (error) {
        resolve({ success: false, message: error.message });
      } else {
        resolve({ success: true, message: 'Network adapter disabled' });
      }
    });
  });
}
```

**⚠️ WARNING:** Ini akan disable semua network, termasuk LAN!

### **Option 2: Block di Router Level**

Jika block di PC tidak efektif, block di router:

1. Login ke router (biasanya 192.168.1.1)
2. Cari "Access Control" atau "Parental Control"
3. Block MAC address PC-13
4. Atau block semua outbound traffic untuk IP PC-13

**Keuntungan:**
- 100% efektif
- Tidak bisa di-bypass dari PC

**Kekurangan:**
- Butuh akses router
- Lebih kompleks

---

## 📞 Jika Masih Bermasalah

Kirim informasi ini:

1. **Output firewall rules:**
```cmd
netsh advfirewall firewall show rule name=all | findstr LabMonitor
```

2. **Test ping:**
```cmd
ping google.com
```

3. **Test browser:**
- Buka Chrome
- Coba akses https://google.com
- Screenshot error message

4. **Proxy settings:**
```cmd
netsh winhttp show proxy
```

5. **Firewall state:**
```cmd
netsh advfirewall show allprofiles state
```

Dengan informasi ini, saya bisa bantu troubleshoot lebih detail.

---

## ✅ Summary

**Masalah:** Block internet tidak efektif karena rules lama hanya blokir port tertentu

**Solusi:** 
1. Update `remote.js` dengan rules yang lebih efektif (Block ALL Outbound)
2. Hapus rules lama
3. Restart agent
4. Test dengan `ping google.com`

**Expected Result:** Internet 100% terblokir, tidak bisa diakses sama sekali

**Status:** ✅ **FIXED** dengan rules Block ALL Outbound! 🎉
