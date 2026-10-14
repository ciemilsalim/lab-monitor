const express = require('express');
const router = express.Router();
const db = require('../config/database');

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
    
    res.json({ success: true, data: alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const computerId = req.body.computer_id;
    const studentId = req.body.student_id;
    const type = req.body.type;
    const message = req.body.message;
    
    const [result] = await db.query(`
      INSERT INTO alerts (computer_id, student_id, type, message)
      VALUES (?, ?, ?, ?)
    `, [computerId, studentId, type, message]);
    
    res.json({ success: true, message: 'Alert created', alertId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    await db.query('UPDATE alerts SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
