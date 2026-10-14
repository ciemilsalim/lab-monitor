/**
 * LabMonitor Backend Server v1.3 - WITH ALERT ENGINE
 * File: src/server.js
 * 
 * FITUR:
 * ✅ REST API (computers, students, activities, alerts, cleanup)
 * ✅ Socket.io untuk real-time communication
 * ✅ Alert Engine - Auto-generate alerts berdasarkan aktivitas
 * ✅ Real-time alert notification via Socket.io
 * ✅ Screenshot request & capture
 * ✅ Remote command relay
 * ✅ Connection tracking & auto-offline
 * 
 * CARA PAKAI:
 * 1. Copy file ini ke src/server.js
 * 2. Copy alertEngine.js ke src/services/alertEngine.js
 * 3. Setup .env
 * 4. Run: npm run dev
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const alertEngine = require('./services/alertEngine');

const app = express();
const server = http.createServer(app);

// ========================================
// CONNECTION TRACKING
// ========================================
// Track connected agents: Map<computerId, { socketId, connectedAt, lastHeartbeat }>
const connectedAgents = new Map();

// Make connectedAgents available to routes
app.set('connectedAgents', connectedAgents);

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
  maxHttpBufferSize: 50 * 1024 * 1024,
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ========================================
// HEALTH CHECK
// ========================================
app.get('/', (req, res) => {
  res.json({
    name: 'LabMonitor API',
    version: '1.3.0',
    status: 'running',
    features: {
      alertEngine: true,
      realTimeAlerts: true,
      screenshot: true,
      remoteControl: true
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    connectedAgents: connectedAgents.size
  });
});

// ========================================
// CONNECTED AGENTS API
// ========================================
app.get('/api/connected-agents', (req, res) => {
  const agents = [];
  for (const [computerId, agentData] of connectedAgents.entries()) {
    agents.push({
      computerId,
      socketId: agentData.socketId,
      connectedAt: new Date(agentData.connectedAt).toISOString(),
      lastHeartbeat: new Date(agentData.lastHeartbeat).toISOString(),
      isAlive: (Date.now() - agentData.lastHeartbeat) < 60000 // 60 seconds
    });
  }
  
  res.json({
    success: true,
    count: agents.length,
    agents: agents
  });
});

// ========================================
// ALERT RULES API
// ========================================
app.get('/api/alert-rules', (req, res) => {
  res.json({
    success: true,
    data: alertEngine.getRules()
  });
});

app.put('/api/alert-rules', (req, res) => {
  try {
    alertEngine.updateRules(req.body);
    res.json({
      success: true,
      message: 'Alert rules updated',
      data: alertEngine.getRules()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========================================
// API ROUTES
// ========================================
app.use('/api/computers', require('./routes/computers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/cleanup', require('./routes/cleanup'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/profile', require('./routes/profile'));

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
      // Track connection
      connectedAgents.set(data.computerId, {
        socketId: socket.id,
        connectedAt: Date.now(),
        lastHeartbeat: Date.now()
      });
      
      await db.query(
        'UPDATE computers SET status = ?, last_heartbeat = NOW() WHERE computer_id = ?',
        ['online', data.computerId]
      );
      console.log('✅ Agent status updated in database');
      
      // Emit status change to all clients
      io.emit('computer-status-changed', { 
        computerId: data.computerId, 
        status: 'online',
        connectedAt: new Date().toISOString()
      });
      
      // Broadcast connected agents list
      io.emit('connected-agents-updated', {
        count: connectedAgents.size,
        agents: Array.from(connectedAgents.keys())
      });
    } catch (error) {
      console.error('❌ Error updating agent status:', error.message);
    }
  });

  // ----------------------------------------
  // COMPUTER UPDATE - SAVE TO DATABASE + CHECK ALERTS
  // ----------------------------------------
  socket.on('computer-update', async (data) => {
    console.log('📡 Computer update received:', data.computerId);
    
    try {
      // Update lastHeartbeat in connectedAgents
      if (connectedAgents.has(data.computerId)) {
        connectedAgents.get(data.computerId).lastHeartbeat = Date.now();
      }
      
      // Get student_id dari database
      const [computers] = await db.query(
        'SELECT id, student_id FROM computers WHERE computer_id = ?',
        [data.computerId]
      );
      
      if (computers.length === 0) {
        console.warn('⚠️ Computer not found:', data.computerId);
        return;
      }
      
      const studentId = computers[0].student_id;
      
      // Update database
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
        console.log('✅ Computer data saved:', data.computerId);
      }
      
      // 🚨 CHECK ALERTS untuk CPU, RAM, Bandwidth
      const alertData = {
        computerId: data.computerId,
        studentId: studentId,
        cpu: data.cpu,
        ram: data.ram,
        networkSpeed: data.networkSpeed
      };
      
      const alerts = await alertEngine.checkActivity(alertData);
      
      // Emit alerts ke frontend
      for (const alert of alerts) {
        io.emit('new-alert', alert);
        console.log(`🚨 Alert generated: ${alert.type} - ${alert.message}`);
      }
      
      // Broadcast computer update
      io.emit('computer-updated', data);
      
    } catch (error) {
      console.error('❌ Error saving computer update:', error.message);
    }
  });

  // ----------------------------------------
  // ACTIVITY LOG - SAVE TO DATABASE + CHECK ALERTS
  // ----------------------------------------
  socket.on('activity-log', async (data) => {
    console.log('🌐 Activity log received from:', data.computerId);
    
    try {
      // Get computer ID dari database
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
      
      // Extract domain dari URL
      let domain = '';
      let category = 'other';
      try {
        if (data.activeUrl && data.activeUrl.startsWith('http')) {
          domain = new URL(data.activeUrl).hostname;
        } else {
          domain = data.activeUrl || '';
        }
      } catch (e) {
        domain = data.activeUrl || '';
      }
      
      // Get category dari tabs
      if (data.tabs && data.tabs.length > 0) {
        const activeTab = data.tabs.find(tab => tab.isActive);
        if (activeTab && activeTab.category) {
          category = activeTab.category;
        }
      }
      
      // Insert main activity
      const [activityResult] = await db.query(
        `INSERT INTO activities (computer_id, student_id, url, domain, category, duration)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [computerDbId, studentId, data.activeUrl || '', domain, category, 0]
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
      
      // 🚨 CHECK ALERTS untuk kategori website
      const alertData = {
        computerId: data.computerId,
        studentId: studentId,
        domain: domain,
        category: category,
        url: data.activeUrl
      };
      
      const alerts = await alertEngine.checkActivity(alertData);
      
      // Emit alerts ke frontend
      for (const alert of alerts) {
        io.emit('new-alert', alert);
        console.log(`🚨 Alert generated: ${alert.type} - ${alert.message}`);
      }
      
      // Broadcast activity
      io.emit('new-activity', {
        id: activityId,
        computerId: data.computerId,
        studentId: studentId,
        url: data.activeUrl || '',
        domain: domain,
        category: category,
        duration: 0,
        tabs: data.tabs || [],
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error saving activity:', error.message);
    }
  });

  // ----------------------------------------
  // REMOTE COMMANDS
  // ----------------------------------------
  socket.on('remote-command', (data) => {
    console.log('🎮 Remote command received:', data);
    io.emit('execute-command', data);
  });

  socket.on('command-result', (data) => {
    console.log('✅ Command result:', data);
    io.emit('command-completed', data);
  });

  // ----------------------------------------
  // SCREENSHOT
  // ----------------------------------------
  socket.on('request-screenshot', (data) => {
    console.log('📸 Screenshot request:', data.computerId);
    io.emit('request-screenshot', data);
  });

  socket.on('screenshot-captured', (data) => {
    console.log('📸 Screenshot captured:', data.computerId);
    io.emit('screenshot-captured', data);
  });

  // ----------------------------------------
  // DISCONNECT
  // ----------------------------------------
  socket.on('disconnect', async () => {
    console.log('❌ Client disconnected:', socket.id);
    
    // Find which computer this socket belongs to
    let disconnectedComputerId = null;
    for (const [computerId, agentData] of connectedAgents.entries()) {
      if (agentData.socketId === socket.id) {
        disconnectedComputerId = computerId;
        break;
      }
    }
    
    if (disconnectedComputerId) {
      console.log('🔴 Agent disconnected:', disconnectedComputerId);
      
      try {
        // Remove from connectedAgents
        connectedAgents.delete(disconnectedComputerId);
        
        // Update database
        await db.query(
          'UPDATE computers SET status = ? WHERE computer_id = ?',
          ['offline', disconnectedComputerId]
        );
        
        // Emit status change to all clients
        io.emit('computer-status-changed', { 
          computerId: disconnectedComputerId, 
          status: 'offline',
          disconnectedAt: new Date().toISOString()
        });
        
        // Broadcast connected agents list
        io.emit('connected-agents-updated', {
          count: connectedAgents.size,
          agents: Array.from(connectedAgents.keys())
        });
        
        console.log('✅ Agent status updated to offline:', disconnectedComputerId);
      } catch (error) {
        console.error('❌ Error updating disconnect status:', error.message);
      }
    }
  });
});

// ========================================
// HEARTBEAT CHECKER
// ========================================
// Check every 30 seconds for agents that haven't sent heartbeat in 60 seconds
setInterval(async () => {
  const now = Date.now();
  const timeout = 60000; // 60 seconds
  
  for (const [computerId, agentData] of connectedAgents.entries()) {
    if (now - agentData.lastHeartbeat > timeout) {
      console.log('⚠️ Agent heartbeat timeout:', computerId);
      
      try {
        // Remove from connectedAgents
        connectedAgents.delete(computerId);
        
        // Update database
        await db.query(
          'UPDATE computers SET status = ? WHERE computer_id = ?',
          ['offline', computerId]
        );
        
        // Emit status change
        io.emit('computer-status-changed', { 
          computerId: computerId, 
          status: 'offline',
          reason: 'heartbeat timeout',
          disconnectedAt: new Date().toISOString()
        });
        
        // Broadcast connected agents list
        io.emit('connected-agents-updated', {
          count: connectedAgents.size,
          agents: Array.from(connectedAgents.keys())
        });
        
        console.log('✅ Agent marked offline due to heartbeat timeout:', computerId);
      } catch (error) {
        console.error('❌ Error updating timeout status:', error.message);
      }
    }
  }
}, 30000); // Check every 30 seconds

// ========================================
// RESET ALL COMPUTERS TO OFFLINE ON STARTUP
// ========================================
async function resetAllComputersOffline() {
  try {
    console.log('🔄 Resetting all computers to offline on startup...');
    await db.query('UPDATE computers SET status = ?', ['offline']);
    console.log('✅ All computers reset to offline');
  } catch (error) {
    console.error('❌ Error resetting computers:', error.message);
  }
}

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Reset all computers to offline before starting server
resetAllComputersOffline().then(() => {
  server.listen(PORT, HOST, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 LabMonitor Backend Server v1.3`);
    console.log('🚀 ========================================');
    console.log(`📡 Local:   http://localhost:${PORT}`);
    console.log(`📡 Network: http://192.168.100.166:${PORT}`);
    console.log('🚀 ========================================');
    console.log('');
    console.log('✅ Socket.io ready');
    console.log('✅ Alert Engine ENABLED');
    console.log('✅ Real-time alerts ENABLED');
    console.log('✅ Auto-generate alerts ENABLED');
    console.log('✅ Connection tracking ENABLED');
    console.log('');
    console.log('📋 Alert Rules:');
    const rules = alertEngine.getRules();
    console.log(`   - Non-educational sites: ${rules.nonEducationalSites.enabled ? 'ON' : 'OFF'}`);
    console.log(`   - High bandwidth (>${rules.highBandwidth.threshold} Mbps): ${rules.highBandwidth.enabled ? 'ON' : 'OFF'}`);
    console.log(`   - High CPU (>${rules.highCPU.threshold}%): ${rules.highCPU.enabled ? 'ON' : 'OFF'}`);
    console.log(`   - High RAM (>${rules.highRAM.threshold}%): ${rules.highRAM.enabled ? 'ON' : 'OFF'}`);
    console.log('');
  });
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
