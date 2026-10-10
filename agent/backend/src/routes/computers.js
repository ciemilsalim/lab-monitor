/**
 * Computers Routes
 * File: src/routes/computers.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/computers - Get all computers
router.get('/', async (req, res) => {
  try {
    const [computers] = await db.query(`
      SELECT c.*, s.name as student_name, s.student_id 
      FROM computers c 
      LEFT JOIN students s ON c.student_id = s.id 
      ORDER BY c.computer_id
    `);
    
    res.json({ 
      success: true, 
      data: computers,
      count: computers.length
    });
  } catch (error) {
    console.error('Error fetching computers:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/computers/:id - Get computer by ID
router.get('/:id', async (req, res) => {
  try {
    const [computers] = await db.query(`
      SELECT c.*, s.name as student_name, s.student_id, s.class
      FROM computers c 
      LEFT JOIN students s ON c.student_id = s.id 
      WHERE c.id = ?
    `, [req.params.id]);
    
    if (computers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Computer not found' 
      });
    }
    
    res.json({ 
      success: true, 
       computers[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT /api/computers/:id/status - Update computer status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, cpu_usage, ram_usage, network_speed, current_app, current_url } = req.body;
    
    await db.query(`
      UPDATE computers 
      SET status = ?, cpu_usage = ?, ram_usage = ?, network_speed = ?, 
          current_app = ?, current_url = ?, last_heartbeat = NOW()
      WHERE id = ?
    `, [status, cpu_usage, ram_usage, network_speed, current_app, current_url, req.params.id]);
    
    res.json({ 
      success: true, 
      message: 'Computer status updated' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
