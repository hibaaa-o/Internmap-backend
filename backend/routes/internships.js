const express = require('express');
const pool = require('../db');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// list all internships with optional filtering
// supported query parameters: title, company, location, start_date, end_date, q (text search)
router.get('/', async (req, res) => {
  try {
    const { title, company, location, start_date, end_date, q } = req.query;
    const conditions = [];
    const values = [];
    let idx = 1;

    if (title) {
      conditions.push(`title ILIKE $${idx++}`);
      values.push(`%${title}%`);
    }
    if (company) {
      conditions.push(`company ILIKE $${idx++}`);
      values.push(`%${company}%`);
    }
    if (location) {
      conditions.push(`location ILIKE $${idx++}`);
      values.push(`%${location}%`);
    }
    if (start_date) {
      conditions.push(`start_date >= $${idx++}`);
      values.push(start_date);
    }
    if (end_date) {
      conditions.push(`end_date <= $${idx++}`);
      values.push(end_date);
    }
    if (q) {
      // simple text search on title and description
      conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }

    let query = 'SELECT * FROM internships';
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// get single internship by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM internships WHERE id=$1', [id]);
    const internship = result.rows[0];
    if (!internship) return res.status(404).json({ error: 'not found' });
    res.json(internship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// create new internship (admin only)
router.post('/', authenticate, authorizeRoles('admin'), async (req, res) => {
  const { title, company, description, location, start_date, end_date } = req.body;
  if (!title || !company) {
    return res.status(400).json({ error: 'title and company required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO internships (title, company, description, location, start_date, end_date)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, company, description || null, location || null, start_date || null, end_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// update internship (admin only)
router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  const { title, company, description, location, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE internships SET
         title = COALESCE($1,title),
         company = COALESCE($2,company),
         description = COALESCE($3,description),
         location = COALESCE($4,location),
         start_date = COALESCE($5,start_date),
         end_date = COALESCE($6,end_date),
         updated_at = NOW()
       WHERE id=$7 RETURNING *`,
      [title, company, description, location, start_date, end_date, id]
    );
    const internship = result.rows[0];
    if (!internship) return res.status(404).json({ error: 'not found' });
    res.json(internship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// delete internship (admin only)
router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM internships WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'not found' });
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
