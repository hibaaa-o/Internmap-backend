const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// helper to generate JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  const opts = { expiresIn: '1h' };
  return jwt.sign(payload, secret, opts);
}

// register a new user (defaults to role 'user')
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hash, role || 'user']
    );
    const user = result.rows[0];
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      // unique_violation
      return res.status(409).json({ error: 'username already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// login existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username=$1',
      [username]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
