const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET applications
router.get('/', authenticate, async (req, res) => {
  try {
    let result;

    if (req.user.role === 'company') {
      result = await pool.query(
        `SELECT 
           a.id,
           a.user_id,
           a.internship_id,
           a.status,
           a.cover_letter,
           a.applied_at,
           u.email AS applicant_email,
           u.full_name AS applicant_name,
           u.phone AS applicant_phone,
           u.cv_name AS applicant_cv,
           i.title AS internship_title,
           i.company AS company_name,
           i.location AS internship_location
         FROM applications a
         JOIN internships i ON a.internship_id = i.id
         JOIN users u ON a.user_id = u.id
         WHERE i.created_by = $1
         ORDER BY a.applied_at DESC`,
        [req.user.id]
      );
    } else if (req.user.role === 'admin') {
      result = await pool.query(
        `SELECT 
           a.id,
           a.user_id,
           a.internship_id,
           a.status,
           a.cover_letter,
           a.applied_at,
           u.email AS applicant_email,
           u.full_name AS applicant_name,
           u.phone AS applicant_phone,
           u.cv_name AS applicant_cv,
           i.title AS internship_title,
           i.company AS company_name,
           i.location AS internship_location
         FROM applications a
         JOIN internships i ON a.internship_id = i.id
         JOIN users u ON a.user_id = u.id
         ORDER BY a.applied_at DESC`
      );
    } else {
      result = await pool.query(
        `SELECT 
           a.id,
           a.user_id,
           a.internship_id,
           a.status,
           a.cover_letter,
           a.applied_at,
           i.title AS internship_title,
           i.company AS company_name,
           i.location AS internship_location
         FROM applications a
         JOIN internships i ON a.internship_id = i.id
         WHERE a.user_id = $1
         ORDER BY a.applied_at DESC`,
        [req.user.id]
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// POST apply
router.post('/', authenticate, async (req, res) => {
  const { internship_id, cover_letter } = req.body;

  if (!internship_id) {
    return res.status(400).json({ error: 'internship_id required' });
  }

  try {
    // check user profile before applying
    const userRes = await pool.query(
      `SELECT full_name, cv_name FROM users WHERE id = $1`,
      [req.user.id]
    );

    const user = userRes.rows[0];

    if (!user || !user.full_name || !user.cv_name) {
      return res.status(400).json({
        error: 'Please complete your profile and upload your CV before applying'
      });
    }

    // optional: prevent duplicate apply
    const existing = await pool.query(
      `SELECT id FROM applications WHERE user_id = $1 AND internship_id = $2`,
      [req.user.id, internship_id]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({
        error: 'You already applied to this internship'
      });
    }

    const result = await pool.query(
      `INSERT INTO applications (user_id, internship_id, cover_letter)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, internship_id, cover_letter || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// UPDATE status
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE applications
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;