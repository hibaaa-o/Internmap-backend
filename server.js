const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

// auth routes & middleware
const authRoutes = require('./routes/auth');
const { authenticate, authorizeRoles } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// make sure required tables exist
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('users table checked/created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT,
        location TEXT,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('internships table checked/created');

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
    console.log('applications table checked/created');

  } catch (err) {
    console.error('error creating tables', err);
  }
}
initDb();

app.get('/', (req, res) => {
  res.json({ message: 'InternMap backend is running!' });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// mount authentication endpoints
app.use('/auth', authRoutes);

// internship endpoints
const internshipsRoutes = require('./routes/internships');
app.use('/internships', internshipsRoutes);

// applications endpoints
const applicationsRoutes = require('./routes/applications');
app.use('/applications', applicationsRoutes);

// admin dashboard endpoints (all routes protected inside)
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
