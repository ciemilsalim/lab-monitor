-- ========================================
-- LabMonitor Database Schema
-- File: database/schema.sql
-- 
-- CARA PAKAI:
-- 1. Buka phpMyAdmin: http://localhost/phpmyadmin
-- 2. Buat database: labmonitor
-- 3. Import file ini
-- ========================================

-- Create database
CREATE DATABASE IF NOT EXISTS labmonitor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE labmonitor;

-- ========================================
-- TABEL: students
-- ========================================
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- TABEL: computers
-- ========================================
CREATE TABLE IF NOT EXISTS computers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  computer_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  ip_address VARCHAR(50) NOT NULL,
  mac_address VARCHAR(50),
  status ENUM('online', 'offline', 'idle', 'locked') DEFAULT 'offline',
  student_id INT,
  cpu_usage DECIMAL(5,2) DEFAULT 0,
  ram_usage DECIMAL(5,2) DEFAULT 0,
  network_speed DECIMAL(10,2) DEFAULT 0,
  os VARCHAR(100),
  current_app VARCHAR(255),
  current_url TEXT,
  last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- ========================================
-- TABEL: activities
-- ========================================
CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  computer_id INT NOT NULL,
  student_id INT,
  url TEXT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  category ENUM('educational', 'social-media', 'entertainment', 'search-engine', 'shopping', 'news', 'productivity', 'email', 'gaming', 'finance', 'other') DEFAULT 'other',
  duration INT DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (computer_id) REFERENCES computers(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  INDEX idx_computer_id (computer_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_category (category)
);

-- ========================================
-- TABEL: browser_tabs
-- ========================================
CREATE TABLE IF NOT EXISTS browser_tabs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  url TEXT NOT NULL,
  domain VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  category ENUM('educational', 'social-media', 'entertainment', 'search-engine', 'shopping', 'news', 'productivity', 'email', 'gaming', 'finance', 'other') DEFAULT 'other',
  is_active BOOLEAN DEFAULT FALSE,
  open_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration INT DEFAULT 0,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  INDEX idx_activity_id (activity_id)
);

-- ========================================
-- TABEL: alerts
-- ========================================
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  computer_id INT NOT NULL,
  student_id INT,
  type ENUM('warning', 'danger', 'info') NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (computer_id) REFERENCES computers(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  INDEX idx_type (type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_is_read (is_read)
);

-- ========================================
-- TABEL: users (untuk authentication)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'guru', 'viewer') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- INSERT SAMPLE DATA
-- ========================================

-- Insert sample students
INSERT INTO students (student_id, name, class) VALUES
('STD2024001', 'Ahmad Rizki', 'XII-RPL1'),
('STD2024002', 'Siti Nurhaliza', 'XII-RPL1'),
('STD2024003', 'Budi Santoso', 'XII-RPL1'),
('STD2024004', 'Dewi Lestari', 'XII-RPL1'),
('STD2024005', 'Eko Prasetyo', 'XII-RPL1')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample computers
INSERT INTO computers (computer_id, name, ip_address, mac_address, student_id, status, cpu_usage, ram_usage, network_speed, os) VALUES
('PC-01', 'Komputer 1', '192.168.100.101', 'AA:BB:CC:DD:EE:01', 1, 'online', 45.5, 62.3, 85.2, 'Windows 11 Pro'),
('PC-02', 'Komputer 2', '192.168.100.102', 'AA:BB:CC:DD:EE:02', 2, 'online', 32.1, 48.7, 92.4, 'Windows 11 Pro'),
('PC-03', 'Komputer 3', '192.168.100.103', 'AA:BB:CC:DD:EE:03', 3, 'idle', 12.8, 35.2, 45.6, 'Windows 11 Pro'),
('PC-04', 'Komputer 4', '192.168.100.104', 'AA:BB:CC:DD:EE:04', 4, 'online', 78.9, 81.4, 67.3, 'Windows 11 Pro'),
('PC-05', 'Komputer 5', '192.168.100.105', 'AA:BB:CC:DD:EE:05', 5, 'offline', 0, 0, 0, 'Windows 11 Pro')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample admin user
-- Password: admin123 (hash bcrypt)
INSERT INTO users (email, password, name, role) VALUES
('admin@labmonitor.local', '$2b$10$YourHashedPasswordHere', 'Admin Lab', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Additional indexes for better query performance
CREATE INDEX idx_computers_status ON computers(status);
CREATE INDEX idx_computers_student_id ON computers(student_id);
CREATE INDEX idx_activities_domain ON activities(domain);
CREATE INDEX idx_alerts_computer_id ON alerts(computer_id);

-- ========================================
-- VIEWS (Optional)
-- ========================================

-- View: Computer with student info
CREATE OR REPLACE VIEW v_computer_details AS
SELECT 
  c.*,
  s.name as student_name,
  s.student_id as student_code,
  s.class
FROM computers c
LEFT JOIN students s ON c.student_id = s.id;

-- View: Recent activities with details
CREATE OR REPLACE VIEW v_recent_activities AS
SELECT 
  a.*,
  c.computer_id,
  c.name as computer_name,
  s.name as student_name,
  s.student_id as student_code
FROM activities a
LEFT JOIN computers c ON a.computer_id = c.id
LEFT JOIN students s ON a.student_id = s.id
ORDER BY a.timestamp DESC
LIMIT 100;

-- ========================================
-- TRIGGERS (Optional)
-- ========================================

-- Trigger: Auto-update computer status when heartbeat is old
DELIMITER //
CREATE TRIGGER trg_check_computer_status
BEFORE UPDATE ON computers
FOR EACH ROW
BEGIN
  IF NEW.last_heartbeat < DATE_SUB(NOW(), INTERVAL 1 MINUTE) THEN
    SET NEW.status = 'offline';
  END IF;
END//
DELIMITER ;

-- ========================================
-- STORED PROCEDURES (Optional)
-- ========================================

-- Procedure: Cleanup old activities
DELIMITER //
CREATE PROCEDURE sp_cleanup_old_activities(IN days_old INT)
BEGIN
  DELETE FROM activities 
  WHERE timestamp < DATE_SUB(NOW(), INTERVAL days_old DAY);
  
  SELECT ROW_COUNT() as deleted_count;
END//
DELIMITER ;

-- Procedure: Get computer statistics
DELIMITER //
CREATE PROCEDURE sp_get_computer_stats()
BEGIN
  SELECT 
    status,
    COUNT(*) as count,
    ROUND(AVG(cpu_usage), 2) as avg_cpu,
    ROUND(AVG(ram_usage), 2) as avg_ram,
    ROUND(AVG(network_speed), 2) as avg_network
  FROM computers
  GROUP BY status;
END//
DELIMITER ;

-- ========================================
-- GRANT PERMISSIONS (Optional)
-- ========================================

-- Create dedicated user for application (optional)
-- CREATE USER 'labmonitor'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON labmonitor.* TO 'labmonitor'@'localhost';
-- FLUSH PRIVILEGES;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check tables
SHOW TABLES;

-- Check data
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_computers FROM computers;
SELECT COUNT(*) as total_activities FROM activities;
SELECT COUNT(*) as total_alerts FROM alerts;

-- Check indexes
SHOW INDEX FROM computers;
SHOW INDEX FROM activities;
SHOW INDEX FROM alerts;

-- ========================================
-- END OF SCHEMA
-- ========================================
