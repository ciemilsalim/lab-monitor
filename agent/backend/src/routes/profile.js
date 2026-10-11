/**
 * Profile Routes - CRUD untuk profil aplikasi
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/profile - Get app profile
router.get('/', async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT * FROM app_profile LIMIT 1');
    
    if (profiles.length === 0) {
      // Return default empty profile
      return res.json({
        success: true,
         {
          id: 1,
          school_name: '',
          school_address: '',
          school_phone: '',
          school_email: '',
          lab_head_name: '',
          lab_head_nip: '',
          lab_head_position: 'Kepala Laboratorium',
          logo_url: '',
          city: '',
          province: '',
          updated_at: new Date().toISOString()
        }
      });
    }
    
    res.json({
      success: true,
       profiles[0]
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/profile - Update app profile
router.put('/', async (req, res) => {
  try {
    const {
      school_name,
      school_address,
      school_phone,
      school_email,
      lab_head_name,
      lab_head_nip,
      lab_head_position,
      logo_url,
      city,
      province
    } = req.body;

    // Check if profile exists
    const [existing] = await db.query('SELECT id FROM app_profile LIMIT 1');
    
    if (existing.length === 0) {
      // Insert new profile
      const [result] = await db.query(
        `INSERT INTO app_profile (
          school_name, school_address, school_phone, school_email,
          lab_head_name, lab_head_nip, lab_head_position,
          logo_url, city, province, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          school_name || '',
          school_address || '',
          school_phone || '',
          school_email || '',
          lab_head_name || '',
          lab_head_nip || '',
          lab_head_position || 'Kepala Laboratorium',
          logo_url || '',
          city || '',
          province || ''
        ]
      );
      
      res.json({
        success: true,
        message: 'Profile created successfully',
        id: result.insertId
      });
    } else {
      // Update existing profile
      await db.query(
        `UPDATE app_profile SET
          school_name = ?,
          school_address = ?,
          school_phone = ?,
          school_email = ?,
          lab_head_name = ?,
          lab_head_nip = ?,
          lab_head_position = ?,
          logo_url = ?,
          city = ?,
          province = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          school_name || '',
          school_address || '',
          school_phone || '',
          school_email || '',
          lab_head_name || '',
          lab_head_nip || '',
          lab_head_position || 'Kepala Laboratorium',
          logo_url || '',
          city || '',
          province || '',
          existing[0].id
        ]
      );
      
      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
