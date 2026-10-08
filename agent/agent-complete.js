/**
 * LabMonitor Agent - COMPLETE VERSION
 * File: C:\labmonitor-agent\src\agent.js
 * 
 * FITUR:
 * ✅ System monitoring (CPU, RAM, Network)
 * ✅ Browser monitoring (all tabs)
 * ✅ Remote command execution
 * ✅ Screenshot capture & send
 * ✅ Auto-reconnect
 * ✅ Logging
 * 
 * CARA PAKAI:
 * 1. Copy file ini ke C:\labmonitor-agent\src\agent.js
 * 2. Restart agent: npm start
 */

const SystemMonitor = require('./monitors/system');
const BrowserMonitor = require('./monitors/browser');
const RemoteController = require('./controllers/remote');
const SocketService = require('./services/socket');
const logger = require('./utils/logger');
const config = require('./utils/config');
const fs = require('fs');

class LabMonitorAgent {
  constructor() {
    this.computerId = config.get('COMPUTER_ID');
    this.studentId = config.get('STUDENT_ID');
    this.socketService = new SocketService();
    this.systemMonitor = new SystemMonitor();
    this.browserMonitor = new BrowserMonitor();
    this.remoteController = new RemoteController();
    
    this.intervals = [];
    this.isRunning = false;
  }

  async start() {
    try {
      logger.info('🚀 ========================================');
      logger.info('🚀 LabMonitor Agent Starting...');
      logger.info(`🚀 Computer ID: ${this.computerId}`);
      logger.info(`🚀 Student ID: ${this.studentId}`);
      logger.info('🚀 ========================================');

      // Connect to backend
      await this.socketService.connect();

      // Start monitoring
      this.startMonitoring();

      // Setup remote command listener
      this.setupRemoteCommands();

      // Setup screenshot listener
      this.setupScreenshotListener();

      this.isRunning = true;
      logger.info('✅ Agent started successfully');

    } catch (error) {
      logger.error('❌ Failed to start agent:', error.message);
      process.exit(1);
    }
  }

  startMonitoring() {
    // System monitoring - every 5 seconds
    const systemInterval = setInterval(async () => {
      try {
        const systemData = await this.systemMonitor.getData();
        
        this.socketService.emit('computer-update', {
          computerId: this.computerId,
          status: 'online',
          cpu: systemData.cpu,
          ram: systemData.ram,
          networkSpeed: systemData.networkSpeed,
          currentApp: systemData.activeApp,
          currentUrl: systemData.activeUrl
        });

        logger.debug('📊 System data sent:', {
          cpu: systemData.cpu,
          ram: systemData.ram,
          network: systemData.networkSpeed
        });

      } catch (error) {
        logger.error('Error in system monitoring:', error.message);
      }
    }, parseInt(config.get('SYSTEM_MONITOR_INTERVAL')) || 5000);

    this.intervals.push(systemInterval);

    // Browser monitoring - every 10 seconds
    const browserInterval = setInterval(async () => {
      try {
        const browserData = await this.browserMonitor.getData();

        if (browserData.tabs.length > 0) {
          this.socketService.emit('activity-log', {
            computerId: this.computerId,
            studentId: this.studentId,
            tabs: browserData.tabs,
            activeUrl: browserData.activeUrl,
            activeTitle: browserData.activeTitle
          });

          logger.debug('🌐 Browser data sent:', {
            tabs: browserData.tabs.length,
            activeUrl: browserData.activeUrl
          });
        }

      } catch (error) {
        logger.error('Error in browser monitoring:', error.message);
      }
    }, parseInt(config.get('BROWSER_MONITOR_INTERVAL')) || 10000);

    this.intervals.push(browserInterval);

    logger.info('✅ Monitoring started');
  }

  setupRemoteCommands() {
    // Listen untuk execute-command dari backend
    this.socketService.on('execute-command', async (command) => {
      try {
        logger.info('📡 ========================================');
        logger.info('📡 Received remote command');
        logger.info(`📡 Action: ${command.action}`);
        logger.info(`📡 Target: ${command.computerId || 'all'}`);
        logger.info('📡 ========================================');
        
        // Check jika command ini untuk komputer ini
        if (command.computerId && command.computerId !== this.computerId) {
          logger.info(`⏭️ Skipping command - not for this computer (${this.computerId})`);
          return;
        }
        
        // Execute command
        const result = await this.remoteController.execute(command);
        
        // Send result back to backend
        this.socketService.emit('command-result', {
          computerId: this.computerId,
          command: command.action,
          success: result.success,
          message: result.message,
          timestamp: new Date().toISOString()
        });

        if (result.success) {
          logger.info('✅ Command executed successfully');
          logger.info(`✅ Result: ${result.message}`);
        } else {
          logger.error('❌ Command execution failed');
          logger.error(`❌ Error: ${result.message}`);
        }

      } catch (error) {
        logger.error('❌ Error executing command:', error.message);
        logger.error('❌ Stack:', error.stack);
        
        this.socketService.emit('command-result', {
          computerId: this.computerId,
          command: command.action,
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    logger.info('✅ Remote command listener active');
  }

  setupScreenshotListener() {
    // Listen untuk screenshot request dari backend
    this.socketService.on('request-screenshot', async (data) => {
      try {
        // Check jika request ini untuk komputer ini
        if (data.computerId && data.computerId !== this.computerId) {
          logger.info(`⏭️ Skipping screenshot request - not for this computer (${this.computerId})`);
          return;
        }

        logger.info('📸 ========================================');
        logger.info('📸 Screenshot request received');
        logger.info(`📸 Computer: ${data.computerName || 'Unknown'}`);
        logger.info(`📸 Student: ${data.studentName || 'Unknown'}`);
        logger.info('📸 ========================================');
        
        // Take screenshot
        const result = await this.remoteController.takeScreenshot();
        
        if (result.success && result.path) {
          // Read screenshot file and convert to base64
          fs.readFile(result.path, (err, fileData) => {
            if (err) {
              logger.error('❌ Failed to read screenshot file:', err.message);
              return;
            }
            
            // Convert to base64
            const base64Image = fileData.toString('base64');
            
            // Emit screenshot to backend
            this.socketService.emit('screenshot-captured', {
              id: Date.now().toString(),
              computerId: this.computerId,
              computerName: data.computerName || 'Unknown',
              studentName: data.studentName || 'Unknown',
              image: `image/png;base64,${base64Image}`,
              timestamp: new Date().toISOString(),
              size: fileData.length,
              path: result.path
            });
            
            logger.info('✅ Screenshot sent to backend');
            logger.info(`✅ Image size: ${(fileData.length / 1024).toFixed(2)} KB`);
          });
        } else {
          logger.error('❌ Failed to take screenshot:', result.message);
        }

      } catch (error) {
        logger.error('❌ Error handling screenshot request:', error.message);
        logger.error('❌ Stack:', error.stack);
      }
    });

    logger.info('✅ Screenshot listener active');
  }

  async stop() {
    logger.info('🛑 Stopping agent...');
    
    this.isRunning = false;
    
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];

    // Disconnect socket
    this.socketService.disconnect();

    logger.info('✅ Agent stopped');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down...');
  const agent = new LabMonitorAgent();
  await agent.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down...');
  const agent = new LabMonitorAgent();
  await agent.stop();
  process.exit(0);
});

// Start agent
const agent = new LabMonitorAgent();
agent.start();

module.exports = LabMonitorAgent;
