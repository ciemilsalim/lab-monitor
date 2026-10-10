-- ========================================
-- SQL untuk menambahkan PC-13 dan Student LAB13
-- Jalankan di phpMyAdmin → Database: labmonitor → Tab SQL
-- ========================================

-- 1. Tambahkan Student LAB13 (jika belum ada)
INSERT INTO students (student_id, name, class) 
VALUES ('LAB13', 'Siswa Lab 13', 'LAB')
ON DUPLICATE KEY UPDATE name = 'Siswa Lab 13';

-- 2. Tambahkan Computer PC-13 (jika belum ada)
INSERT INTO computers (computer_id, name, ip_address, mac_address, student_id, status, os) 
SELECT 'PC-13', 'Komputer 13', '192.168.100.113', 'AA:BB:CC:DD:EE:13', s.id, 'offline', 'Windows 11 Pro'
FROM students s 
WHERE s.student_id = 'LAB13'
ON DUPLICATE KEY UPDATE name = 'Komputer 13';

-- 3. Verifikasi data sudah masuk
SELECT c.id, c.computer_id, c.name, c.ip_address, c.status, s.student_id, s.name as student_name
FROM computers c
LEFT JOIN students s ON c.student_id = s.id
WHERE c.computer_id = 'PC-13';

-- ========================================
-- Setelah agent berjalan, data akan otomatis update:
-- - status: online
-- - cpu_usage: XX.XX
-- - ram_usage: XX.XX
-- - network_speed: XX.XX
-- - current_app: nama aplikasi aktif
-- - current_url: URL aktif
-- - last_heartbeat: timestamp terakhir
-- ========================================
