/**
 * Socket Service - Koneksi ke backend via Socket.io
 */

const { io } = require('socket.io-client');
const logger = require('../utils/logger');
const config = require('../utils/config');

class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = parseInt(config.get('MAX_RECONNECT_ATTEMPTS')) || 10;
    this.reconnectDelay = parseInt(config.get('RECONNECT_DELAY')) || 5000;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const backendUrl = config.get('BACKEND_URL');
      
      if (!backendUrl) {
        reject(new Error('BACKEND_URL not configured'));
        return;
      }

      logger.info(`🔌 Connecting to backend: ${backendUrl}`);

      this.socket = io(backendUrl, {
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 20000,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        logger.info('✅ Connected to backend');
        logger.info(`📡 Socket ID: ${this.socket.id}`);
        
        this.reconnectAttempts = 0;
        
        // Register agent
        this.socket.emit('agent-connect', {
          computerId: config.get('COMPUTER_ID'),
          studentId: config.get('STUDENT_ID'),
          timestamp: new Date().toISOString()
        });

        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        logger.warn(`❌ Disconnected from backend: ${reason}`);
      });

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++;
        logger.error(`Connection error (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error.message);
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          logger.error('Max reconnection attempts reached');
          reject(new Error('Max reconnection attempts reached'));
        }
      });

      this.socket.on('reconnect', (attemptNumber) => {
        logger.info(`🔄 Reconnected after ${attemptNumber} attempts`);
        this.reconnectAttempts = 0;
      });

      this.socket.on('reconnect_error', (error) => {
        logger.error('Reconnection error:', error.message);
      });

      this.socket.on('reconnect_failed', () => {
        logger.error('❌ Reconnection failed');
      });

      // Timeout for initial connection
      setTimeout(() => {
        if (!this.socket.connected) {
          reject(new Error('Connection timeout'));
        }
      }, 20000);
    });
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
      return true;
    } else {
      logger.warn('Socket not connected, cannot emit event:', event);
      return false;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      logger.info('Socket disconnected');
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

module.exports = SocketService;
