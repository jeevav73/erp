const { initializePool } = require('../src/database/connection');
require('dotenv').config();

const email = process.argv[2];
const password = process.argv[3];
if (!email) {
  console.error('Usage: node scripts/resetPassword.js <email>');
  process.exit(1);
}

async function run() {
  const pool = await initializePool();
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute('SELECT id, name, email, role, password, created_at FROM users WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
      console.log(`No user found with email: ${email}`);
      process.exit(0);
    }
    console.log('User record:');
    console.table(rows);
    await conn.execute('UPDATE users SET password = ? WHERE email = ?', [password, email]);
    console.log('Password reset successful');
  } catch (err) {
    console.error('Error querying user:', err.message || err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

run();
