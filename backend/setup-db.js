#!/usr/bin/env node
/**
 * Database Setup Helper
 * This script creates the 'internmap' database if it doesn't exist
 */

const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'sixbits',
    port: 5432,
  });

  try {
    console.log('🔗 Connecting to PostgreSQL server...');
    await client.connect();

    console.log('📊 Creating "internmap" database...');
    await client.query('CREATE DATABASE internmap;');

    console.log('✅ Database created successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Create a .env file with:');
    console.log('      PORT=5000');
    console.log('      JWT_SECRET=your_secret_key');
    console.log('   2. Run: npm run dev');
    console.log('   3. Tables will be created automatically\n');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('✅ Database "internmap" already exists!');
    } else {
      console.error('❌ Error:', err.message);
    }
  } finally {
    await client.end();
  }
}

setupDatabase();
