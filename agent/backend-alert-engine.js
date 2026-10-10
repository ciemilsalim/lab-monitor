/**
 * Alert Engine - Auto-generate alerts berdasarkan aktivitas siswa
 * File: D:\labmonitor-backend\src\services\alertEngine.js
 */

const db = require('../config/database');

class AlertEngine {
  constructor() {
    // Default rules untuk alert
    this.rules = {
      // Alert untuk kategori website non-edukasi
      nonEducationalSites: {
        enabled: true,
        categories: ['social-media', 'entertainment', 'gaming', 'shopping'],
        level: 'warning',
        message: 'Mengakses situs non-edukasi: {domain}'
      },
      
      // Alert untuk situs berbahaya
      dangerousSites: {
        enabled: true,
        categories: ['adult', 'gambling', 'malware'],
        level: 'danger',
        message: 'Mengakses situs berbahaya: {domain}'
      },
      
      // Alert untuk bandwidth tinggi
      highBandwidth: {
        enabled: true,
        threshold: 50, // Mbps
        level: 'warning',
        message: 'Bandwidth usage tinggi: {bandwidth} Mbps'
      },
      
      // Alert untuk CPU tinggi
      highCPU: {
        enabled: true,
        threshold: 90, // persen
        level: 'warning',
        message: 'CPU usage tinggi: {cpu}%'
      },
      
      // Alert untuk RAM tinggi
      highRAM: {
        enabled: true,
        threshold: 90, // persen
        level: 'warning',
        message: 'RAM usage tinggi: {ram}%'
      },
      
      // Alert untuk idle terlalu lama
      idleTimeout: {
        enabled: true,
        threshold: 15, // menit
        level: 'info',
        message: 'Tidak aktif selama {minutes} menit'
      }
    };
    
    // Track last alert time untuk prevent spam
    this.lastAlertTime = new Map();
    this.ALERT_COOLDOWN = 5 * 60 * 1000; // 5 menit cooldown per computer per rule
  }

  /**
   * Check activity dan generate alert jika perlu
   */
  async checkActivity(activityData) {
    const alerts = [];
    
    try {
      // 1. Check kategori website
      if (this.rules.nonEducationalSites.enabled) {
        const alert = await this.checkNonEducationalSite(activityData);
        if (alert) alerts.push(alert);
      }
      
      // 2. Check bandwidth
      if (this.rules.highBandwidth.enabled && activityData.networkSpeed) {
        const alert = await this.checkHighBandwidth(activityData);
        if (alert) alerts.push(alert);
      }
      
      // 3. Check CPU
      if (this.rules.highCPU.enabled && activityData.cpu) {
        const alert = await this.checkHighCPU(activityData);
        if (alert) alerts.push(alert);
      }
      
      // 4. Check RAM
      if (this.rules.highRAM.enabled && activityData.ram) {
        const alert = await this.checkHighRAM(activityData);
        if (alert) alerts.push(alert);
      }
      
      // Save semua alerts ke database
      for (const alert of alerts) {
        await this.saveAlert(alert);
      }
      
      return alerts;
      
    } catch (error) {
      console.error('❌ Error checking activity for alerts:', error.message);
      return [];
    }
  }

  /**
   * Check apakah siswa mengakses situs non-edukasi
   */
  async checkNonEducationalSite(activityData) {
    const { computerId, studentId, domain, category } = activityData;
    
    // Check apakah kategori ada di list non-edukasi
    if (this.rules.nonEducationalSites.categories.includes(category)) {
      // Check cooldown
      const cooldownKey = `${computerId}:nonEducational`;
      if (this.isInCooldown(cooldownKey)) {
        return null;
      }
      
      // Get student name
      const [students] = await db.query(
        'SELECT name FROM students WHERE id = ?',
        [studentId]
      );
      const studentName = students.length > 0 ? students[0].name : 'Unknown';
      
      // Get computer name
      const [computers] = await db.query(
        'SELECT name FROM computers WHERE computer_id = ?',
        [computerId]
      );
      const computerName = computers.length > 0 ? computers[0].name : computerId;
      
      const message = this.rules.nonEducationalSites.message
        .replace('{domain}', domain);
      
      this.setCooldown(cooldownKey);
      
      return {
        computer_id: computerId,
        student_id: studentId,
        type: this.rules.nonEducationalSites.level,
        message: message,
        student_name: studentName,
        computer_name: computerName
      };
    }
    
    return null;
  }

  /**
   * Check bandwidth usage
   */
  async checkHighBandwidth(activityData) {
    const { computerId, studentId, networkSpeed } = activityData;
    
    if (networkSpeed > this.rules.highBandwidth.threshold) {
      const cooldownKey = `${computerId}:highBandwidth`;
      if (this.isInCooldown(cooldownKey)) {
        return null;
      }
      
      const [students] = await db.query(
        'SELECT name FROM students WHERE id = ?',
        [studentId]
      );
      const studentName = students.length > 0 ? students[0].name : 'Unknown';
      
      const message = this.rules.highBandwidth.message
        .replace('{bandwidth}', networkSpeed.toFixed(2));
      
      this.setCooldown(cooldownKey);
      
      return {
        computer_id: computerId,
        student_id: studentId,
        type: this.rules.highBandwidth.level,
        message: message,
        student_name: studentName
      };
    }
    
    return null;
  }

  /**
   * Check CPU usage
   */
  async checkHighCPU(activityData) {
    const { computerId, studentId, cpu } = activityData;
    
    if (cpu > this.rules.highCPU.threshold) {
      const cooldownKey = `${computerId}:highCPU`;
      if (this.isInCooldown(cooldownKey)) {
        return null;
      }
      
      const [students] = await db.query(
        'SELECT name FROM students WHERE id = ?',
        [studentId]
      );
      const studentName = students.length > 0 ? students[0].name : 'Unknown';
      
      const message = this.rules.highCPU.message
        .replace('{cpu}', cpu.toFixed(1));
      
      this.setCooldown(cooldownKey);
      
      return {
        computer_id: computerId,
        student_id: studentId,
        type: this.rules.highCPU.level,
        message: message,
        student_name: studentName
      };
    }
    
    return null;
  }

  /**
   * Check RAM usage
   */
  async checkHighRAM(activityData) {
    const { computerId, studentId, ram } = activityData;
    
    if (ram > this.rules.highRAM.threshold) {
      const cooldownKey = `${computerId}:highRAM`;
      if (this.isInCooldown(cooldownKey)) {
        return null;
      }
      
      const [students] = await db.query(
        'SELECT name FROM students WHERE id = ?',
        [studentId]
      );
      const studentName = students.length > 0 ? students[0].name : 'Unknown';
      
      const message = this.rules.highRAM.message
        .replace('{ram}', ram.toFixed(1));
      
      this.setCooldown(cooldownKey);
      
      return {
        computer_id: computerId,
        student_id: studentId,
        type: this.rules.highRAM.level,
        message: message,
        student_name: studentName
      };
    }
    
    return null;
  }

  /**
   * Save alert ke database
   */
  async saveAlert(alertData) {
    try {
      const [result] = await db.query(
        `INSERT INTO alerts (computer_id, student_id, type, message, timestamp)
         VALUES (?, ?, ?, ?, NOW())`,
        [
          alertData.computer_id,
          alertData.student_id,
          alertData.type,
          alertData.message
        ]
      );
      
      console.log(`✅ Alert saved: ${alertData.type} - ${alertData.message}`);
      
      return {
        id: result.insertId,
        ...alertData,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Error saving alert:', error.message);
      return null;
    }
  }

  /**
   * Check apakah dalam cooldown period
   */
  isInCooldown(key) {
    const lastTime = this.lastAlertTime.get(key);
    if (!lastTime) return false;
    
    const now = Date.now();
    return (now - lastTime) < this.ALERT_COOLDOWN;
  }

  /**
   * Set cooldown time
   */
  setCooldown(key) {
    this.lastAlertTime.set(key, Date.now());
  }

  /**
   * Update rules
   */
  updateRules(newRules) {
    this.rules = { ...this.rules, ...newRules };
    console.log('✅ Alert rules updated');
  }

  /**
   * Get current rules
   */
  getRules() {
    return this.rules;
  }
}

module.exports = new AlertEngine();
