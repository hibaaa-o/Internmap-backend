const express = require('express');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

// GET profile
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, role, full_name, phone, cv_name
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET /profile error:', err);
    res.status(500).json({ error: 'database error' });
  }
});

// UPDATE profile info
router.put('/', authenticate, async (req, res) => {
  try {
    const { full_name, phone } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET full_name = $1,
           phone = $2
       WHERE id = $3
       RETURNING id, email, role, full_name, phone, cv_name`,
      [full_name || '', phone || '', req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /profile error:', err);
    res.status(500).json({ error: 'database error' });
  }
});



// UPLOAD CV
router.post('/upload-cv', authenticate, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await pool.query(
      `UPDATE users
       SET cv_name = $1
       WHERE id = $2
       RETURNING id, email, role, full_name, phone, cv_name`,
      [req.file.filename, req.user.id]
    );

    res.json({
      message: 'CV uploaded successfully',
      profile: result.rows[0],
      fileUrl: `http://127.0.0.1:5000/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error('POST /profile/upload-cv error:', err);
    res.status(500).json({ error: err.message || 'database error' });
  }
});

module.exports = router;