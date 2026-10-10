/**
 * LabMonitor Backend Server - COMPLETE VERSION
 * File: D:\labmonitor-backend\src\server.js
 * 
 * FITUR:
 * ✅ REST API (computers, students, activities, alerts)
 * ✅ Socket.io untuk real-time communication
 * ✅ Database save untuk computer updates
 * ✅ Database save untuk activity logs
 * ✅ Remote command relay
 * ✅ Screenshot request & capture
 * 
 * CARA PAKAI:
 * 1. Copy file ini ke D:\labmonitor-backend\src\server.js
 * 2. Restart backend: npm run dev
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const server = http.createServer(app);

// ========================================
// SOCKET.IO CONFIGURATION
// ========================================
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      process.env.CORS_ORIGIN_NETWORK || 'http://192.168.100.166:3000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
  maxHttpBufferSize: 50 * 1024 * 1024, // 50 MB - untuk base64 image besar
  transports: ['websocket', 'polling']
});

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    process.env.CORS_ORIGIN_NETWORK || 'http://192.168.100.166:3000',
    'http://localhost:5173',
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ========================================
// HEALTH CHECK & INFO ENDPOINTS
// ========================================
app.get('/', (req, res) => {
  res.json({
    name: 'LabMonitor API',
    version: '1.0.0',
    status: 'running',
    serverIP: req.socket.localAddress,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========================================
// API ROUTES
// ========================================
app.use('/api/computers', require('./routes/computers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/alerts', require('./routes/alerts'));

// ========================================
// SOCKET.IO HANDLERS
// ========================================
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // ----------------------------------------
  // AGENT CONNECTION
  // ----------------------------------------
  socket.on('agent-connect', async (data) => {
    console.log('🤖 Agent connected:', data.computerId);
    
    try {
      await db.query(
        'UPDATE computers SET status = ?, last_heartbeat = NOW() WHERE computer_id = ?',
        ['online', data.computerId]
      );
      console.log('✅ Agent status updated in database');
      io.emit('computer-updated', { computerId: data.computerId, status: 'online' });
    } catch (error) {
      console.error('❌ Error updating agent status:', error.message);
    }
  });

  // ----------------------------------------
  // COMPUTER UPDATE - SAVE TO DATABASE
  // ----------------------------------------
  socket.on('computer-update', async (data) => {
    console.log('📡 Computer update received:', data.computerId);
    
    try {
      const [result] = await db.query(
        `UPDATE computers 
         SET status = ?, cpu_usage = ?, ram_usage = ?, network_speed = ?, 
             current_app = ?, current_url = ?, last_heartbeat = NOW()
         WHERE computer_id = ?`,
        [
          data.status || 'online',
          data.cpu || 0,
          data.ram || 0,
          data.networkSpeed || 0,
          data.currentApp || '',
          data.currentUrl || '',
          data.computerId
        ]
      );
      
      if (result.affectedRows > 0) {
        console.log('✅ Computer data saved to database:', data.computerId);
      } else {
        console.warn('⚠️ Computer not found in database:', data.computerId);
      }
      
      // Broadcast to all connected clients (frontend)
      io.emit('computer-updated', data);
      
    } catch (error) {
      console.error('❌ Error saving computer update:', error.message);
    }
  });

  // ----------------------------------------
  // ACTIVITY LOG - SAVE TO DATABASE
  // ----------------------------------------
  socket.on('activity-log', async (data) => {
    console.log('🌐 Activity log received from:', data.computerId);
    
    try {
      // Get computer ID from database
      const [computers] = await db.query(
        'SELECT id, student_id FROM computers WHERE computer_id = ?',
        [data.computerId]
      );
      
      if (computers.length === 0) {
        console.error('❌ Computer not found:', data.computerId);
        return;
      }
      
      const computerDbId = computers[0].id;
      const studentId = computers[0].student_id;
      
      // Extract domain from URL
      let domain = '';
      try {
        if (data.activeUrl && data.activeUrl.startsWith('http')) {
          domain = new URL(data.activeUrl).hostname;
        } else {
          domain = data.activeUrl || '';
        }
      } catch (e) {
        domain = data.activeUrl || '';
      }
      
      // Insert main activity
      const [activityResult] = await db.query(
        `INSERT INTO activities (computer_id, student_id, url, domain, category, duration)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [computerDbId, studentId, data.activeUrl || '', domain, 'other', 0]
      );
      
      const activityId = activityResult.insertId;
      
      // Insert browser tabs
      if (data.tabs && data.tabs.length > 0) {
        for (const tab of data.tabs) {
          await db.query(
            `INSERT INTO browser_tabs (activity_id, url, domain, title, category, is_active, duration)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [activityId, tab.url, tab.domain, tab.title, tab.category || 'other', tab.isActive ? 1 : 0, tab.duration || 0]
          );
        }
        console.log(`✅ Saved ${data.tabs.length} browser tabs`);
      }
      
      console.log('✅ Activity saved to database, ID:', activityId);
      
      // Broadcast to all connected clients (frontend)
      io.emit('new-activity', {
        id: activityId,
        computerId: data.computerId,
        studentId: studentId,
        url: data.activeUrl || '',
        domain: domain,
        category: 'other',
        duration: 0,
        tabs: data.tabs || [],
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error saving activity:', error.message);
    }
  });

  // ----------------------------------------
  // REMOTE COMMANDS - RELAY TO AGENT
  // ----------------------------------------
  socket.on('remote-command', (data) => {
    console.log('🎮 Remote command received:', data);
    // Broadcast to all agents
    io.emit('execute-command', data);
  });

  // ----------------------------------------
  // COMMAND RESULT FROM AGENT
  // ----------------------------------------
  socket.on('command-result', (data) => {
    console.log('✅ Command result:', data);
    // Broadcast to frontend
    io.emit('command-completed', data);
  });

  // ----------------------------------------
  // SCREENSHOT REQUEST - FROM FRONTEND TO AGENT
  // ----------------------------------------
  socket.on('request-screenshot', (data) => {
    console.log('📸 Screenshot request received for:', data.computerId);
    console.log('📸 Computer:', data.computerName);
    console.log('📸 Student:', data.studentName);
    
    // Broadcast to all agents (agent yang sesuai akan respond)
    io.emit('request-screenshot', {
      computerId: data.computerId,
      computerName: data.computerName,
      studentName: data.studentName,
      timestamp: data.timestamp
    });
  });

  // ----------------------------------------
  // SCREENSHOT CAPTURED - FROM AGENT TO FRONTEND
  // ----------------------------------------
  socket.on('screenshot-captured', (data) => {
    console.log('📸 Screenshot captured from:', data.computerId);
    console.log('📸 Image size:', (data.size / 1024).toFixed(2), 'KB');
    
    // Broadcast to all connected frontends
    io.emit('screenshot-captured', {
      id: data.id || Date.now().toString(),
      computerId: data.computerId,
      computerName: data.computerName,
      studentName: data.studentName,
      image: data.image, // base64 encoded image
      timestamp: data.timestamp || new Date().toISOString(),
      size: data.size || 0,
      path: data.path
    });
  });

  // ----------------------------------------
  // DISCONNECT
  // ----------------------------------------
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`🚀 LabMonitor Backend Server`);
  console.log('🚀 ========================================');
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`📡 Network: http://192.168.100.166:${PORT}`);
  console.log(`💚 Health:  http://localhost:${PORT}/health`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('✅ Socket.io ready for connections');
  console.log('✅ Database save enabled for real-time data');
  console.log('✅ Screenshot feature enabled');
  console.log('✅ Remote control relay enabled');
  console.log('');
});

// ========================================
// ERROR HANDLING
// ========================================
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
