const express = require('express');
const router = express.Router();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

router.get('/stats', async (req, res) => {
  try {
    const [activities] = await db.query('SELECT COUNT(*) as count FROM activities');
    const [browserTabs] = await db.query('SELECT COUNT(*) as count FROM browser_tabs');
    const [alerts] = await db.query('SELECT COUNT(*) as count FROM alerts');
    
    const [dataSize] = await db.query(`
      SELECT 
        table_name,
        ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
      FROM information_schema.tables
      WHERE table_schema = 'labmonitor'
      AND table_name IN ('activities', 'browser_tabs', 'alerts')
    `);
    
    const [oldActivities] = await db.query(`
      SELECT COUNT(*) as count 
      FROM activities 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    
    const [veryOldActivities] = await db.query(`
      SELECT COUNT(*) as count 
      FROM activities 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    const statsData = {
      activities: {
        total: activities[0].count,
        older_than_7_days: oldActivities[0].count,
        older_than_30_days: veryOldActivities[0].count
      },
      browser_tabs: {
        total: browserTabs[0].count
      },
      alerts: {
        total: alerts[0].count
      },
      database_size: {
        tables: dataSize,
        total_mb: dataSize.reduce((sum, t) => sum + parseFloat(t.size_mb || 0), 0).toFixed(2)
      }
    };
    
    res.json({ success: true, data: statsData });
  } catch (error) {
    console.error('Error getting cleanup stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/activities', async (req, res) => {
  try {
    const days = req.body.days || 7;
    
    console.log(`🧹 Cleaning up activities older than ${days} days...`);
    
    const [deletedTabs] = await db.query(`
      DELETE FROM browser_tabs 
      WHERE activity_id IN (
        SELECT id FROM activities 
        WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
      )
    `, [days]);
    
    const [deletedActivities] = await db.query(`
      DELETE FROM activities 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [days]);
    
    console.log(`✅ Deleted ${deletedActivities.affectedRows} activities and ${deletedTabs.affectedRows} browser tabs`);
    
    const resultData = {
      deleted_activities: deletedActivities.affectedRows,
      deleted_browser_tabs: deletedTabs.affectedRows,
      older_than_days: days
    };
    
    res.json({ success: true, message: 'Cleanup completed', data: resultData });
  } catch (error) {
    console.error('Error cleaning up activities:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/alerts', async (req, res) => {
  try {
    const days = req.body.days || 30;
    const readOnly = req.body.read_only || false;
    
    console.log(`🧹 Cleaning up alerts older than ${days} days...`);
    
    let query = 'DELETE FROM alerts WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)';
    const params = [days];
    
    if (readOnly) {
      query += ' AND is_read = TRUE';
    }
    
    const [deletedAlerts] = await db.query(query, params);
    
    console.log(`✅ Deleted ${deletedAlerts.affectedRows} alerts`);
    
    const resultData = {
      deleted_alerts: deletedAlerts.affectedRows,
      older_than_days: days,
      read_only: readOnly
    };
    
    res.json({ success: true, message: 'Alerts cleanup completed', data: resultData });
  } catch (error) {
    console.error('Error cleaning up alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/screenshots', async (req, res) => {
  try {
    const days = req.body.days || 7;
    
    console.log(`🧹 Cleaning up screenshots older than ${days} days...`);
    
    const screenshotsDir = path.join(process.env.SCREENSHOTS_DIR || 'screenshots');
    
    if (!fs.existsSync(screenshotsDir)) {
      return res.json({
        success: true,
        message: 'No screenshots directory found',
        data: { deleted_files: 0, freed_space_mb: 0 }
      });
    }
    
    const files = fs.readdirSync(screenshotsDir);
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    let deletedCount = 0;
    let freedSpace = 0;
    
    files.forEach(file => {
      const filePath = path.join(screenshotsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < cutoffTime) {
        freedSpace += stats.size;
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    console.log(`✅ Deleted ${deletedCount} screenshot files, freed ${(freedSpace / 1024 / 1024).toFixed(2)} MB`);
    
    const resultData = {
      deleted_files: deletedCount,
      freed_space_mb: (freedSpace / 1024 / 1024).toFixed(2),
      older_than_days: days
    };
    
    res.json({ success: true, message: 'Screenshots cleanup completed', data: resultData });
  } catch (error) {
    console.error('Error cleaning up screenshots:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/all', async (req, res) => {
  try {
    const activitiesDays = req.body.activities_days || 7;
    const alertsDays = req.body.alerts_days || 30;
    const screenshotsDays = req.body.screenshots_days || 7;
    
    console.log('🧹 Running full cleanup...');
    
    const [deletedTabs] = await db.query(`
      DELETE FROM browser_tabs 
      WHERE activity_id IN (
        SELECT id FROM activities 
        WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
      )
    `, [activitiesDays]);
    
    const [deletedActivities] = await db.query(`
      DELETE FROM activities 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [activitiesDays]);
    
    const [deletedAlerts] = await db.query(`
      DELETE FROM alerts 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [alertsDays]);
    
    const screenshotsDir = path.join(process.env.SCREENSHOTS_DIR || 'screenshots');
    let deletedScreenshots = 0;
    let freedSpace = 0;
    
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      const cutoffTime = Date.now() - (screenshotsDays * 24 * 60 * 60 * 1000);
      
      files.forEach(file => {
        const filePath = path.join(screenshotsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtimeMs < cutoffTime) {
          freedSpace += stats.size;
          fs.unlinkSync(filePath);
          deletedScreenshots++;
        }
      });
    }
    
    console.log('✅ Full cleanup completed');
    
    const resultData = {
      deleted_activities: deletedActivities.affectedRows,
      deleted_browser_tabs: deletedTabs.affectedRows,
      deleted_alerts: deletedAlerts.affectedRows,
      deleted_screenshots: deletedScreenshots,
      freed_space_mb: (freedSpace / 1024 / 1024).toFixed(2),
      activities_older_than_days: activitiesDays,
      alerts_older_than_days: alertsDays,
      screenshots_older_than_days: screenshotsDays
    };
    
    res.json({ success: true, message: 'Full cleanup completed', data: resultData });
  } catch (error) {
    console.error('Error in full cleanup:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/optimize', async (req, res) => {
  try {
    console.log('🔧 Optimizing database tables...');
    
    await db.query('OPTIMIZE TABLE activities');
    await db.query('OPTIMIZE TABLE browser_tabs');
    await db.query('OPTIMIZE TABLE alerts');
    
    console.log('✅ Database optimization completed');
    
    res.json({ success: true, message: 'Database optimization completed' });
  } catch (error) {
    console.error('Error optimizing database:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
