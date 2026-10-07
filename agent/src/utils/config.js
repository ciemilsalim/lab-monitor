/**
 * Config - Helper untuk membaca konfigurasi dari .env
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

class Config {
  static get(key) {
    return process.env[key];
  }

  static getOrDefault(key, defaultValue) {
    return process.env[key] || defaultValue;
  }

  static getAll() {
    return {
      BACKEND_URL: process.env.BACKEND_URL,
      COMPUTER_ID: process.env.COMPUTER_ID,
      STUDENT_ID: process.env.STUDENT_ID,
      SYSTEM_MONITOR_INTERVAL: process.env.SYSTEM_MONITOR_INTERVAL,
      BROWSER_MONITOR_INTERVAL: process.env.BROWSER_MONITOR_INTERVAL,
      LOG_LEVEL: process.env.LOG_LEVEL,
      LOG_FILE: process.env.LOG_FILE,
      RECONNECT_DELAY: process.env.RECONNECT_DELAY,
      MAX_RECONNECT_ATTEMPTS: process.env.MAX_RECONNECT_ATTEMPTS
    };
  }

  static validate() {
    const required = ['BACKEND_URL', 'COMPUTER_ID'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }
}

module.exports = Config;
