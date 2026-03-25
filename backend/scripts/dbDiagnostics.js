const { initializePool } = require('../src/database/connection');
require('dotenv').config();

async function run() {
  try {
    const pool = await initializePool();
    const conn = await pool.getConnection();
    console.log('DB diagnostics: connected to MySQL');

    const [users] = await conn.execute('SELECT id, name, email, role, password FROM users\G');
    console.log(`Found ${users.length} users`);
    console.table(users);

    const [counts] = await conn.execute('SELECT COUNT(*) as count FROM users');
    console.log('User count:', counts[0].count);

    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('DB diagnostics error:', err.message || err);
    process.exit(1);
  }
}

run();
