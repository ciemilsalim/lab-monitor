const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const server = http.createServer(app);

// Socket.io - CORS untuk localhost DAN network
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CORS_ORIGIN,
      process.env.CORS_ORIGIN_NETWORK,
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000
});

// CORS middleware
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN,
    process.env.CORS_ORIGIN_NETWORK,
    'http://localhost:5173',
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
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

// API Routes
app.use('/api/computers', require('./routes/computers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/alerts', require('./routes/alerts'));

// ========================================
// SOCKET.IO HANDLERS - SAVE TO DATABASE
// ========================================
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Handle agent connection
  socket.on('agent-connect', async (data) => {
    console.log('🤖 Agent connected:', data.computerId);
    
    try {
      // Update computer status to online
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

  // Handle computer status update dari agent - SAVE TO DATABASE
  socket.on('computer-update', async (data) => {
    console.log('📡 Computer update received:', data.computerId);
    
    try {
      // Save to database
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

  // Handle browsing activity - SAVE TO DATABASE
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
        [
          computerDbId,
          studentId,
          data.activeUrl || '',
          domain,
          'other',
          0
        ]
      );
      
      const activityId = activityResult.insertId;
      
      // Insert browser tabs
      if (data.tabs && data.tabs.length > 0) {
        for (const tab of data.tabs) {
          await db.query(
            `INSERT INTO browser_tabs (activity_id, url, domain, title, category, is_active, duration)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              activityId,
              tab.url,
              tab.domain,
              tab.title,
              tab.category || 'other',
              tab.isActive ? 1 : 0,
              tab.duration || 0
            ]
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

  // Handle remote commands - forward to agent
  socket.on('remote-command', (data) => {
    console.log('🎮 Remote command received:', data);
    // Broadcast to all agents
    io.emit('execute-command', data);
  });

  // Handle command result from agent
  socket.on('command-result', (data) => {
    console.log('✅ Command result:', data);
    // Broadcast to frontend
    io.emit('command-completed', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ⚠️ PENTING: Listen di 0.0.0.0 agar bisa diakses dari network!
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
  console.log('✅ Socket.io ready for agent connections');
  console.log('✅ Database save enabled for real-time data');
  console.log('');
});
