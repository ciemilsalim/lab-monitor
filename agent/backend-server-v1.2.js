/**
 * LabMonitor Backend Server - v1.2.0
 * File: D:\labmonitor-backend\src\server.js
 * 
 * PERUBAHAN v1.2.0:
 * ✅ Track connected agents secara real-time
 * ✅ Auto-update status ke "offline" saat agent disconnect
 * ✅ Heartbeat timeout detection (60 detik tanpa update = offline)
 * ✅ Emit "computer-offline" event ke frontend
 * ✅ Tampilkan "last seen" timestamp
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
// CONNECTED AGENTS TRACKING
// ========================================
// Map: computerId -> { socketId, lastHeartbeat, connectedAt }
const connectedAgents = new Map();

// Heartbeat timeout (60 detik)
const HEARTBEAT_TIMEOUT = 60 * 1000;

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
  pingInterval: 10000,
  pingTimeout: 20000,
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
    version: '1.2.0',
    status: 'running',
    connectedAgents: connectedAgents.size,
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

// Endpoint untuk cek connected agents
app.get('/api/connected-agents', (req, res) => {
  const agents = [];
  connectedAgents.forEach((data, computerId) => {
    agents.push({
      computerId,
      socketId: data.socketId,
      connectedAt: data.connectedAt,
      lastHeartbeat: data.lastHeartbeat,
      isAlive: Date.now() - data.lastHeartbeat < HEARTBEAT_TIMEOUT
    });
  });
  res.json({ success: true, count: agents.length, agents });
});

// ========================================
// API ROUTES
// ========================================
app.use('/api/computers', require('./routes/computers'));
app.use('/api/students', require('./routes/students'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/alerts', require('./routes/alerts'));

// ========================================
// HELPER FUNCTIONS
// ========================================
async function getFullComputerData(computerId) {
  try {
    const [computers] = await db.query(
      `SELECT c.*, s.name as student_name, s.student_id, s.class
       FROM computers c 
       LEFT JOIN students s ON c.student_id = s.id 
       WHERE c.computer_id = ?`,
      [computerId]
    );
    
    if (computers.length === 0) return null;
    
    const c = computers[0];
    const isConnected = connectedAgents.has(computerId);
    
    return {
      computerId: c.computer_id,
      name: c.name,
      ipAddress: c.ip_address,
      macAddress: c.mac_address || '',
      status: isConnected ? 'online' : 'offline', // REAL-TIME STATUS!
      studentName: c.student_name || 'Belum ditetapkan',
      studentId: c.student_id || '',
      studentClass: c.class || '',
      cpu: Number(c.cpu_usage) || 0,
      ram: Number(c.ram_usage) || 0,
      networkSpeed: Number(c.network_speed) || 0,
      os: c.os || 'Windows 11 Pro',
      currentApp: c.current_app || '',
      currentUrl: c.current_url || '',
      lastHeartbeat: c.last_heartbeat,
      isConnected: isConnected, // NEW: flag koneksi real-time
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting computer ', error.message);
    return null;
  }
}

async function setComputerOffline(computerId, reason = 'disconnected') {
  try {
    console.log(`🔴 Setting computer OFFLINE: ${computerId} (reason: ${reason})`);
    
    // Update database
    await db.query(
      'UPDATE computers SET status = ? WHERE computer_id = ?',
      ['offline', computerId]
    );
    
    // Remove from connected agents
    connectedAgents.delete(computerId);
    
    // Broadcast ke semua frontend
    io.emit('computer-offline', {
      computerId: computerId,
      status: 'offline',
      reason: reason,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Computer ${computerId} marked as offline`);
    
  } catch (error) {
    console.error('❌ Error setting computer offline:', error.message);
  }
}

// ========================================
// HEARTBEAT CHECKER (setiap 15 detik)
// ========================================
setInterval(async () => {
  const now = Date.now();
  const timeoutComputers = [];
  
  // Cek agent yang sudah timeout
  connectedAgents.forEach((data, computerId) => {
    const timeSinceLastHeartbeat = now - data.lastHeartbeat;
    
    if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) {
      console.log(`⚠️ Heartbeat timeout: ${computerId} (${Math.floor(timeSinceLastHeartbeat / 1000)}s ago)`);
      timeoutComputers.push(computerId);
    }
  });
  
  // Set offline untuk yang timeout
  for (const computerId of timeoutComputers) {
    await setComputerOffline(computerId, 'heartbeat timeout');
  }
  
}, 15000); // Check setiap 15 detik

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
      // Track agent connection
      connectedAgents.set(data.computerId, {
        socketId: socket.id,
        lastHeartbeat: Date.now(),
        connectedAt: Date.now()
      });
      
      // Update database
      await db.query(
        'UPDATE computers SET status = ?, last_heartbeat = NOW() WHERE computer_id = ?',
        ['online', data.computerId]
      );
      
      console.log('✅ Agent tracked & status updated:', data.computerId);
      console.log(`📊 Total connected agents: ${connectedAgents.size}`);
      
      // Get full computer data
      const fullData = await getFullComputerData(data.computerId);
      
      if (fullData) {
        io.emit('computer-updated', fullData);
        console.log('✅ Full computer data broadcasted:', data.computerId);
      }
      
    } catch (error) {
      console.error('❌ Error handling agent connect:', error.message);
    }
  });

  // ----------------------------------------
  // COMPUTER UPDATE (heartbeat dari agent)
  // ----------------------------------------
  socket.on('computer-update', async (data) => {
    // Update last heartbeat di tracking
    if (connectedAgents.has(data.computerId)) {
      connectedAgents.get(data.computerId).lastHeartbeat = Date.now();
    }
    
    try {
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
        console.log('📡 Computer update saved:', data.computerId, 
                    `CPU: ${data.cpu}%, RAM: ${data.ram}%`);
      }
      
      // Get full data & broadcast
      const fullData = await getFullComputerData(data.computerId);
      if (fullData) {
        io.emit('computer-updated', fullData);
      }
      
    } catch (error) {
      console.error('❌ Error saving computer update:', error.message);
    }
  });

  // ----------------------------------------
  // ACTIVITY LOG
  // ----------------------------------------
  socket.on('activity-log', async (data) => {
    // Update heartbeat
    if (connectedAgents.has(data.computerId)) {
      connectedAgents.get(data.computerId).lastHeartbeat = Date.now();
    }
    
    console.log('🌐 Activity log from:', data.computerId);
    
    try {
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
      
      const [activityResult] = await db.query(
        `INSERT INTO activities (computer_id, student_id, url, domain, category, duration)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [computerDbId, studentId, data.activeUrl || '', domain, 'other', 0]
      );
      
      const activityId = activityResult.insertId;
      
      if (data.tabs && data.tabs.length > 0) {
        for (const tab of data.tabs) {
          await db.query(
            `INSERT INTO browser_tabs (activity_id, url, domain, title, category, is_active, duration)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [activityId, tab.url, tab.domain, tab.title, tab.category || 'other', tab.isActive ? 1 : 0, tab.duration || 0]
          );
        }
      }
      
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
  // REMOTE COMMANDS
  // ----------------------------------------
  socket.on('remote-command', (data) => {
    console.log('🎮 Remote command:', data);
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
  // REQUEST COMPUTER LIST
  // ----------------------------------------
  socket.on('request-computer-list', async () => {
    try {
      const [computers] = await db.query(
        `SELECT c.*, s.name as student_name, s.student_id, s.class
         FROM computers c 
         LEFT JOIN students s ON c.student_id = s.id 
         ORDER BY c.computer_id`
      );
      
      const fullDataList = computers.map(c => {
        const isConnected = connectedAgents.has(c.computer_id);
        return {
          computerId: c.computer_id,
          name: c.name,
          ipAddress: c.ip_address,
          macAddress: c.mac_address || '',
          status: isConnected ? 'online' : 'offline', // REAL-TIME!
          studentName: c.student_name || 'Belum ditetapkan',
          studentId: c.student_id || '',
          studentClass: c.class || '',
          cpu: Number(c.cpu_usage) || 0,
          ram: Number(c.ram_usage) || 0,
          networkSpeed: Number(c.network_speed) || 0,
          os: c.os || 'Windows 11 Pro',
          currentApp: c.current_app || '',
          currentUrl: c.current_url || '',
          lastHeartbeat: c.last_heartbeat,
          isConnected: isConnected,
          timestamp: new Date().toISOString()
        };
      });
      
      socket.emit('computer-list', fullDataList);
      console.log(`📋 Sent computer list: ${fullDataList.length} computers (${connectedAgents.size} connected)`);
      
    } catch (error) {
      console.error('❌ Error getting computer list:', error.message);
    }
  });

  // ----------------------------------------
  // DISCONNECT - PENTING!
  // ----------------------------------------
  socket.on('disconnect', async (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} (reason: ${reason})`);
    
    // Cari computer yang terhubung ke socket ini
    let disconnectedComputerId = null;
    
    connectedAgents.forEach((data, computerId) => {
      if (data.socketId === socket.id) {
        disconnectedComputerId = computerId;
      }
    });
    
    // Set offline jika ada agent yang disconnect
    if (disconnectedComputerId) {
      await setComputerOffline(disconnectedComputerId, `socket disconnect: ${reason}`);
      console.log(`📊 Total connected agents: ${connectedAgents.size}`);
    }
  });
});

// ========================================
// STARTUP: Reset semua status ke offline
// ========================================
async function resetAllComputersOffline() {
  try {
    console.log('🔄 Resetting all computers to offline on startup...');
    await db.query('UPDATE computers SET status = ? WHERE status = ?', ['offline', 'online']);
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

// Reset semua status ke offline saat server start
resetAllComputersOffline().then(() => {
  server.listen(PORT, HOST, () => {
    console.log('');
    console.log('🚀 ========================================');
    console.log(`🚀 LabMonitor Backend Server v1.2.0`);
    console.log('🚀 ========================================');
    console.log(`📡 Local:   http://localhost:${PORT}`);
    console.log(`📡 Network: http://192.168.100.166:${PORT}`);
    console.log(`💚 Health:  http://localhost:${PORT}/health`);
    console.log(`📊 Connected Agents API: http://localhost:${PORT}/api/connected-agents`);
    console.log('🚀 ========================================');
    console.log('');
    console.log('✅ Real-time connection tracking ENABLED');
    console.log('✅ Auto-offline on disconnect ENABLED');
    console.log('✅ Heartbeat timeout detection ENABLED (60s)');
    console.log('✅ All computers reset to offline on startup');
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
