const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db');
const nodemailer = require("nodemailer");

const router = express.Router();

// helper to generate JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  const opts = { expiresIn: '1h' };
  return jwt.sign(payload, secret, opts);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// register a new user
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hash, role || 'user']
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'email already exists' });
    }

    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// login existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password, role FROM users WHERE email = $1',
      [email]
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

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

// forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    await pool.query(
      `UPDATE users
       SET reset_token = $1,
           reset_token_expiry = NOW() + INTERVAL '15 minutes'
       WHERE email = $2`,
      [token, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    console.log("📩 Sending email to:", email);

    await transporter.sendMail({
      from: `"InternMap" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Password</h2>
        <p>Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes</p>
      `,
    });

    res.json({ message: 'Email sent' });
  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err);
    res.status(500).json({ error: 'err.message' });
  }
});
// reset password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }

  try {
    const userResult = await pool.query(
      `SELECT id
       FROM users
       WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (userResult.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [hashedPassword, userResult.rows[0].id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;