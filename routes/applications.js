const express = require('express');
const pool = require('../db');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// helper to check ownership or admin
function checkAccess(req, application) {
  if (req.user.role === 'admin') return true;
  return application.user_id === req.user.id;
}

// list applications: admin sees all, user sees own
router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await pool.query('SELECT * FROM applications ORDER BY applied_at DESC');
    } else {
      result = await pool.query('SELECT * FROM applications WHERE user_id=$1 ORDER BY applied_at DESC', [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// get single application
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM applications WHERE id=$1', [id]);
    const application = result.rows[0];
    if (!application) return res.status(404).json({ error: 'not found' });
    if (!checkAccess(req, application)) return res.status(403).json({ error: 'forbidden' });
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// create new application (user must be authenticated)
router.post('/', authenticate, async (req, res) => {
  const { internship_id, cover_letter } = req.body;
  if (!internship_id) return res.status(400).json({ error: 'internship_id required' });
  try {
    // optionally verify internship exists
    const internRes = await pool.query('SELECT id FROM internships WHERE id=$1', [internship_id]);
    if (internRes.rowCount === 0) return res.status(400).json({ error: 'invalid internship_id' });

    const result = await pool.query(
      `INSERT INTO applications (user_id, internship_id, cover_letter)
       VALUES ($1,$2,$3) RETURNING *`,
      [req.user.id, internship_id, cover_letter || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// update application: owner can update cover_letter; admin can update status or any field
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { status, cover_letter } = req.body;
  try {
    const res1 = await pool.query('SELECT * FROM applications WHERE id=$1', [id]);
    const application = res1.rows[0];
    if (!application) return res.status(404).json({ error: 'not found' });
    if (!checkAccess(req, application)) return res.status(403).json({ error: 'forbidden' });

    // determine allowed updates
    const updates = [];
    const values = [];
    let idx = 1;

    if (cover_letter !== undefined && application.user_id === req.user.id) {
      updates.push(`cover_letter=$${idx++}`);
      values.push(cover_letter);
    }
    if (status !== undefined && req.user.role === 'admin') {
      updates.push(`status=$${idx++}`);
      values.push(status);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'nothing to update or insufficient permissions' });
    }

    updates.push(`updated_at=NOW()`);
    const query = `UPDATE applications SET ${updates.join(', ')} WHERE id=$${idx} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// delete application: owner or admin
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const res1 = await pool.query('SELECT * FROM applications WHERE id=$1', [id]);
    const application = res1.rows[0];
    if (!application) return res.status(404).json({ error: 'not found' });
    if (!checkAccess(req, application)) return res.status(403).json({ error: 'forbidden' });

    await pool.query('DELETE FROM applications WHERE id=$1', [id]);
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
