const express = require('express');
const pool = require('../db');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// all routes here require admin
router.use(authenticate, authorizeRoles('admin'));

// basic dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const usersRes = await pool.query('SELECT COUNT(*)::int AS count FROM users');
    const internsRes = await pool.query('SELECT COUNT(*)::int AS count FROM internships');
    const appsRes = await pool.query('SELECT COUNT(*)::int AS count FROM applications');
    const appsByStatusRes = await pool.query(
      `SELECT status, COUNT(*)::int AS count
       FROM applications
       GROUP BY status`);

    res.json({
      users: usersRes.rows[0].count,
      internships: internsRes.rows[0].count,
      applications: appsRes.rows[0].count,
      applicationsByStatus: appsByStatusRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
