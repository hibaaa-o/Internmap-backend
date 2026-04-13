#!/usr/bin/env node
/**
 * Database Setup Helper
 * Creates the 'internmap' database AND all required tables
 */

const { Client } = require('pg');

async function setupDatabase() {
  // Connect to default postgres DB first
  const rootClient = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'sixbits',
    port: 5432,
    database: 'postgres'
  });

  try {
    console.log('🔗 Connecting to PostgreSQL server...');
    await rootClient.connect();

    console.log('📊 Creating "internmap" database...');
    await rootClient.query('CREATE DATABASE internmap;');
    console.log('✅ Database created successfully!');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('✅ Database "internmap" already exists!');
    } else {
      console.error('❌ Error creating database:', err.message);
    }
  } finally {
    await rootClient.end();
  }

  // Now connect to internmap DB to create tables
  const dbClient = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'sixbits',
    port: 5432,
    database: 'internmap'
  });

  try {
    await dbClient.connect();
    console.log('🛠️ Creating tables...');

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ users table checked/created');

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ internships table checked/created');

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        internship_id INTEGER REFERENCES internships(id),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ applications table checked/created');

    console.log('🎉 All tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    await dbClient.end();
  }
}

setupDatabase();