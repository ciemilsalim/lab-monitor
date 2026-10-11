/**
 * Reports Routes - Generate laporan monitoring
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/reports/monitoring - Get monitoring report data
router.get('/monitoring', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Validate dates
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'start_date and end_date are required'
      });
    }

    // Query activities with student and computer info
    const [activities] = await db.query(`
      SELECT 
        a.id,
        a.timestamp,
        a.url,
        a.domain,
        a.category,
        a.duration,
        s.name as student_name,
        s.student_id,
        c.computer_id,
        c.name as computer_name,
        CASE 
          WHEN a.category IN ('social-media', 'entertainment', 'gaming', 'shopping') THEN 1
          ELSE 0
        END as is_violation
      FROM activities a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN computers c ON a.computer_id = c.id
      WHERE DATE(a.timestamp) BETWEEN ? AND ?
      ORDER BY a.timestamp DESC
      LIMIT 1000
    `, [start_date, end_date]);

    // Calculate summary
    const totalActivities = activities.length;
    const totalViolations = activities.filter(a => a.is_violation).length;
    const uniqueStudents = new Set(activities.map(a => a.student_id)).size;
    const uniqueComputers = new Set(activities.map(a => a.computer_id)).size;

    // Get app profile for report header
    const [profiles] = await db.query('SELECT * FROM app_profile LIMIT 1');
    const profile = profiles.length > 0 ? profiles[0] : null;

    res.json({
      success: true,
      data: {
        activities: activities.map(a => ({
          id: a.id,
          timestamp: a.timestamp,
          student_name: a.student_name || 'Unknown',
          computer_id: a.computer_id || 'Unknown',
          domain: a.domain,
          category: a.category,
          duration: a.duration || 0,
          is_violation: Boolean(a.is_violation)
        })),
        summary: {
          total_activities: totalActivities,
          total_violations: totalViolations,
          total_students: uniqueStudents,
          total_computers: uniqueComputers,
          date_range: {
            start: start_date,
            end: end_date
          }
        },
        profile: profile
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
