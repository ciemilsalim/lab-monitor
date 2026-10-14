/**
 * LabMonitor Agent - Main Entry Point
 * Program monitoring untuk PC siswa yang berjalan di background
 */

const SystemMonitor = require('./monitors/system');
const BrowserMonitor = require('./monitors/browser');
const RemoteController = require('./controllers/remote');
const SocketService = require('./services/socket');
const logger = require('./utils/logger');
const config = require('./utils/config');

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
    // Command queue for throttling
    this.commandQueue = [];
    this.isProcessingQueue = false;
    this.LAST_MOUSE_MOVE_TIME = 0;
    this.MOUSE_MOVE_THROTTLE = 50; // Only allow mouse move every 50ms
    
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
        
        // OPTIMIZED: Throttle mouse move commands
        if (command.action === 'mouse_move' || command.action === 'move_mouse') {
          const now = Date.now();
          if (now - this.LAST_MOUSE_MOVE_TIME < this.MOUSE_MOVE_THROTTLE) {
            logger.debug(`⏱️ Mouse move throttled (${now - this.LAST_MOUSE_MOVE_TIME}ms)`);
            return; // Skip this command
          }
          this.LAST_MOUSE_MOVE_TIME = now;
        }
        
        // OPTIMIZED: Queue system for commands
        this.commandQueue.push(command);
        
        if (!this.isProcessingQueue) {
          this.processCommandQueue();
        }

      } catch (error) {
        logger.error('❌ Error handling command:', error.message);
        logger.error('❌ Stack:', error.stack);
      }
    });

    logger.info('✅ Remote command listener active (with throttling)');
  }

  /**
   * Process command queue with throttling
   */
  async processCommandQueue() {
    this.isProcessingQueue = true;
    
    while (this.commandQueue.length > 0) {
      const command = this.commandQueue.shift();
      
      try {
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
        
        // Small delay between commands to prevent overload
        await new Promise(r => setTimeout(r, 50));
        
      } catch (error) {
        logger.error('❌ Error executing command:', error.message);
        
        this.socketService.emit('command-result', {
          computerId: this.computerId,
          command: command.action,
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    this.isProcessingQueue = false;
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
