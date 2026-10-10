/**
 * Alerts Routes
 * File: src/routes/alerts.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/alerts - Get all alerts
router.get('/', async (req, res) => {
  try {
    const [alerts] = await db.query(`
      SELECT a.*, c.computer_id, s.name as student_name
      FROM alerts a
      LEFT JOIN computers c ON a.computer_id = c.id
      LEFT JOIN students s ON a.student_id = s.id
      ORDER BY a.timestamp DESC
      LIMIT 50
    `);
    
    res.json({ 
      success: true, 
      data: alerts,
      count: alerts.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/alerts - Create new alert
router.post('/', async (req, res) => {
  try {
    const { computer_id, student_id, type, message } = req.body;
    
    const [result] = await db.query(`
      INSERT INTO alerts (computer_id, student_id, type, message)
      VALUES (?, ?, ?, ?)
    `, [computer_id, student_id, type, message]);
    
    res.json({ 
      success: true, 
      message: 'Alert created',
      alertId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT /api/alerts/:id/read - Mark alert as read
router.put('/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE alerts SET is_read = TRUE WHERE id = ?', [req.params.id]);
    
    res.json({ 
      success: true, 
      message: 'Alert marked as read' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
