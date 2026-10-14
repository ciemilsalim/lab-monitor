const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT * FROM app_profile LIMIT 1');
    
    if (profiles.length === 0) {
      const defaultProfile = {
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
      };
      return res.json({ success: true, profile: defaultProfile });
    }
    
    const profileData = profiles[0];
    res.json({ success: true, profile: profileData });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const profileData = req.body;
    const [existing] = await db.query('SELECT id FROM app_profile LIMIT 1');
    
    if (existing.length === 0) {
      const [result] = await db.query(
        `INSERT INTO app_profile (
          school_name, school_address, school_phone, school_email,
          lab_head_name, lab_head_nip, lab_head_position,
          logo_url, city, province, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          profileData.school_name || '',
          profileData.school_address || '',
          profileData.school_phone || '',
          profileData.school_email || '',
          profileData.lab_head_name || '',
          profileData.lab_head_nip || '',
          profileData.lab_head_position || 'Kepala Laboratorium',
          profileData.logo_url || '',
          profileData.city || '',
          profileData.province || ''
        ]
      );
      
      res.json({ success: true, message: 'Profile created successfully', id: result.insertId });
    } else {
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
          profileData.school_name || '',
          profileData.school_address || '',
          profileData.school_phone || '',
          profileData.school_email || '',
          profileData.lab_head_name || '',
          profileData.lab_head_nip || '',
          profileData.lab_head_position || 'Kepala Laboratorium',
          profileData.logo_url || '',
          profileData.city || '',
          profileData.province || '',
          existing[0].id
        ]
      );
      
      res.json({ success: true, message: 'Profile updated successfully' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
