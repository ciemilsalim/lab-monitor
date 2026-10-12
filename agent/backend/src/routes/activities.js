const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [activities] = await db.query(`
      SELECT a.*, c.computer_id, s.name as student_name
      FROM activities a
      LEFT JOIN computers c ON a.computer_id = c.id
      LEFT JOIN students s ON a.student_id = s.id
      ORDER BY a.timestamp DESC
      LIMIT 100
    `);
    
    res.json({ success: true, data: activities, count: activities.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const computerId = req.body.computer_id;
    const studentId = req.body.student_id;
    const url = req.body.url;
    const domain = req.body.domain;
    const category = req.body.category;
    const duration = req.body.duration;
    
    const [result] = await db.query(`
      INSERT INTO activities (computer_id, student_id, url, domain, category, duration)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [computerId, studentId, url, domain, category, duration]);
    
    res.json({ success: true, message: 'Activity logged', activityId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
