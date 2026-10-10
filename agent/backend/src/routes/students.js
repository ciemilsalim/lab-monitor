/**
 * Students Routes
 * File: src/routes/students.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students ORDER BY name');
    
    res.json({ 
      success: true, 
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/students/:id - Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const [students] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    
    if (students.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    res.json({ 
      success: true, 
       students[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
