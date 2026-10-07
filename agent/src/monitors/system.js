/**
 * System Monitor - Monitoring CPU, RAM, Network, Active Application
 */

const si = require('systeminformation');
const logger = require('../utils/logger');

class SystemMonitor {
  constructor() {
    this.lastNetworkStats = null;
  }

  async getData() {
    try {
      // Get CPU usage
      const cpuData = await si.currentLoad();
      const cpu = Math.round(cpuData.currentLoad * 100) / 100;

      // Get RAM usage
      const memData = await si.mem();
      const ram = Math.round((memData.active / memData.total) * 100 * 100) / 100;

      // Get network speed
      const networkSpeed = await this.getNetworkSpeed();

      // Get active application
      const activeApp = await this.getActiveApplication();

      // Get active URL (if browser is active)
      const activeUrl = await this.getActiveUrl();

      return {
        cpu,
        ram,
        networkSpeed,
        activeApp,
        activeUrl,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error getting system data:', error.message);
      return {
        cpu: 0,
        ram: 0,
        networkSpeed: 0,
        activeApp: 'Unknown',
        activeUrl: '',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getNetworkSpeed() {
    try {
      const netStats = await si.networkStats();
      
      if (!netStats || netStats.length === 0) {
        return 0;
      }

      const currentStats = netStats[0];
      
      if (this.lastNetworkStats) {
        const timeDiff = (currentStats.sec - this.lastNetworkStats.sec) || 1;
        const rxDiff = currentStats.rx_sec - this.lastNetworkStats.rx_sec;
        const txDiff = currentStats.tx_sec - this.lastNetworkStats.tx_sec;
        
        // Calculate Mbps
        const totalBytes = rxDiff + txDiff;
        const mbps = (totalBytes * 8) / (1024 * 1024);
        
        this.lastNetworkStats = currentStats;
        
        return Math.round(mbps * 100) / 100;
      }

      this.lastNetworkStats = currentStats;
      return 0;

    } catch (error) {
      logger.error('Error getting network speed:', error.message);
      return 0;
    }
  }

  async getActiveApplication() {
    try {
      // Try to get active window
      const activeWindow = require('active-win');
      const win = await activeWindow();
      
      if (win && win.title) {
        return win.owner.name || 'Unknown';
      }
      
      return 'Unknown';

    } catch (error) {
      logger.debug('Could not get active application:', error.message);
      return 'Unknown';
    }
  }

  async getActiveUrl() {
    try {
      const activeWindow = require('active-win');
      const win = await activeWindow();
      
      if (!win) return '';

      // Check if active window is a browser
      const browserNames = ['chrome', 'firefox', 'msedge', 'opera', 'brave'];
      const appName = (win.owner.name || '').toLowerCase();
      
      const isBrowser = browserNames.some(browser => appName.includes(browser));
      
      if (isBrowser && win.title) {
        // Try to extract URL from title (not always accurate)
        // This is a simplified approach - real implementation would use browser extensions
        const title = win.title;
        
        // Common patterns
        if (title.includes(' - ')) {
          const parts = title.split(' - ');
          return parts[parts.length - 1].trim();
        }
        
        return title;
      }

      return '';

    } catch (error) {
      logger.debug('Could not get active URL:', error.message);
      return '';
    }
  }
}

module.exports = SystemMonitor;
