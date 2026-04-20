const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const pool = require('./db');

// routes
const authRoutes = require('./routes/auth');
const internshipsRoutes = require('./routes/internships');
const applicationsRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        full_name TEXT,
        phone TEXT,
        cv_name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT,
        location TEXT,
        start_date DATE,
        end_date DATE,
        requirements TEXT,
        working_hours TEXT,
        experience_level TEXT,
        internship_type TEXT,
        skills TEXT,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        internship_id INTEGER NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending',
        cover_letter TEXT,
        applied_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Database ready ✅');
  } catch (err) {
    console.error('DB init error ❌', err);
  }
}

initDb();

app.use('/auth', authRoutes);
app.use('/internships', internshipsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'InternMap backend is running 🚀' });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Database error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});