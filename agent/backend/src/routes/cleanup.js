/**
 * Cleanup Routes
 * File: src/routes/cleanup.js
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// ========================================
// GET /api/cleanup/stats - Statistik data
// ========================================
router.get('/stats', async (req, res) => {
  try {
    // Hitung jumlah data di setiap tabel
    const [activities] = await db.query('SELECT COUNT(*) as count FROM activities');
    const [browserTabs] = await db.query('SELECT COUNT(*) as count FROM browser_tabs');
    const [alerts] = await db.query('SELECT COUNT(*) as count FROM alerts');
    
    // Hitung ukuran data
    const [dataSize] = await db.query(`
      SELECT 
        table_name,
        ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
      FROM information_schema.tables
      WHERE table_schema = 'labmonitor'
      AND table_name IN ('activities', 'browser_tabs', 'alerts')
    `);
    
    // Hitung data berdasarkan usia
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
    
    res.json({
      success: true,
       {
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
      }
    });
  } catch (error) {
    console.error('Error getting cleanup stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========================================
// DELETE /api/cleanup/activities - Hapus aktivitas lama
// ========================================
router.delete('/activities', async (req, res) => {
  try {
    const { days = 7 } = req.body; // Default: hapus data older than 7 days
    
    console.log(`🧹 Cleaning up activities older than ${days} days...`);
    
    // Hapus browser_tabs yang terkait dengan activities lama
    const [deletedTabs] = await db.query(`
      DELETE FROM browser_tabs 
      WHERE activity_id IN (
        SELECT id FROM activities 
        WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
      )
    `, [days]);
    
    // Hapus activities lama
    const [deletedActivities] = await db.query(`
      DELETE FROM activities 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [days]);
    
    console.log(`✅ Deleted ${deletedActivities.affectedRows} activities and ${deletedTabs.affectedRows} browser tabs`);
    
    res.json({
      success: true,
      message: `Cleanup completed`,
       {
        deleted_activities: deletedActivities.affectedRows,
        deleted_browser_tabs: deletedTabs.affectedRows,
        older_than_days: days
      }
    });
  } catch (error) {
    console.error('Error cleaning up activities:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========================================
// DELETE /api/cleanup/alerts - Hapus alerts lama
// ========================================
router.delete('/alerts', async (req, res) => {
  try {
    const { days = 30, read_only = false } = req.body; // Default: hapus alerts older than 30 days
    
    console.log(`🧹 Cleaning up alerts older than ${days} days...`);
    
    let query = 'DELETE FROM alerts WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)';
    const params = [days];
    
    if (read_only) {
      query += ' AND is_read = TRUE';
    }
    
    const [deletedAlerts] = await db.query(query, params);
    
    console.log(`✅ Deleted ${deletedAlerts.affectedRows} alerts`);
    
    res.json({
      success: true,
      message: `Alerts cleanup completed`,
       {
        deleted_alerts: deletedAlerts.affectedRows,
        older_than_days: days,
        read_only: read_only
      }
    });
  } catch (error) {
    console.error('Error cleaning up alerts:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========================================
// DELETE /api/cleanup/screenshots - Hapus file screenshot
// ========================================
router.delete('/screenshots', async (req, res) => {
  try {
    const { days = 7 } = req.body; // Default: hapus screenshot older than 7 days
    
    console.log(`🧹 Cleaning up screenshots older than ${days} days...`);
    
    // Cari folder screenshots di semua PC (simulasi - di production, agent yang hapus)
    const screenshotsDir = path.join(process.env.SCREENSHOTS_DIR || 'screenshots');
    
    if (!fs.existsSync(screenshotsDir)) {
      return res.json({
        success: true,
        message: 'No screenshots directory found',
         {
          deleted_files: 0,
          freed_space_mb: 0
        }
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
    
    res.json({
      success: true,
      message: `Screenshots cleanup completed`,
       {
        deleted_files: deletedCount,
        freed_space_mb: (freedSpace / 1024 / 1024).toFixed(2),
        older_than_days: days
      }
    });
  } catch (error) {
    console.error('Error cleaning up screenshots:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========================================
// DELETE /api/cleanup/all - Hapus semua data lama
// ========================================
router.delete('/all', async (req, res) => {
  try {
    const { 
      activities_days = 7, 
      alerts_days = 30, 
      screenshots_days = 7 
    } = req.body;
    
    console.log('🧹 Running full cleanup...');
    
    // 1. Cleanup activities
    const [deletedTabs] = await db.query(`
      DELETE FROM browser_tabs 
      WHERE activity_id IN (
        SELECT id FROM activities 
        WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
      )
    `, [activities_days]);
    
    const [deletedActivities] = await db.query(`
      DELETE FROM activities 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [activities_days]);
    
    // 2. Cleanup alerts
    const [deletedAlerts] = await db.query(`
      DELETE FROM alerts 
      WHERE timestamp < DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [alerts_days]);
    
    // 3. Cleanup screenshots
    const screenshotsDir = path.join(process.env.SCREENSHOTS_DIR || 'screenshots');
    let deletedScreenshots = 0;
    let freedSpace = 0;
    
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      const cutoffTime = Date.now() - (screenshots_days * 24 * 60 * 60 * 1000);
      
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
    
    res.json({
      success: true,
      message: 'Full cleanup completed',
       {
        deleted_activities: deletedActivities.affectedRows,
        deleted_browser_tabs: deletedTabs.affectedRows,
        deleted_alerts: deletedAlerts.affectedRows,
        deleted_screenshots: deletedScreenshots,
        freed_space_mb: (freedSpace / 1024 / 1024).toFixed(2),
        activities_older_than_days: activities_days,
        alerts_older_than_days: alerts_days,
        screenshots_older_than_days: screenshots_days
      }
    });
  } catch (error) {
    console.error('Error in full cleanup:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========================================
// POST /api/cleanup/optimize - Optimize database
// ========================================
router.post('/optimize', async (req, res) => {
  try {
    console.log('🔧 Optimizing database tables...');
    
    // Optimize tables untuk reclaim space
    await db.query('OPTIMIZE TABLE activities');
    await db.query('OPTIMIZE TABLE browser_tabs');
    await db.query('OPTIMIZE TABLE alerts');
    
    console.log('✅ Database optimization completed');
    
    res.json({
      success: true,
      message: 'Database optimization completed'
    });
  } catch (error) {
    console.error('Error optimizing database:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
