-- ========================================
-- TABEL: app_profile
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
  logo_url LONGTEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- INSERT DEFAULT DATA (Optional)
-- ========================================
-- Uncomment dan sesuaikan dengan data sekolah Anda
/*
INSERT INTO app_profile (
  school_name, school_address, school_phone, school_email,
  lab_head_name, lab_head_nip, lab_head_position,
  city, province
) VALUES (
  'SMA Negeri 1 Jakarta',
  'Jl. Pendidikan No. 123, Jakarta Pusat',
  '(021) 1234-5678',
  'info@sman1jakarta.sch.id',
  'Budi Santoso, S.Pd',
  '196801011990031001',
  'Kepala Laboratorium',
  'Jakarta',
  'DKI Jakarta'
);
*/
