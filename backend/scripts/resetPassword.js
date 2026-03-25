const { initializePool } = require('../src/database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const email = process.argv[2];
const newPassword = process.argv[3];
if (!email || !newPassword) {
  console.error('Usage: node scripts/resetPassword.js <email> <newPassword>');
  process.exit(1);
}

async function run() {
  const pool = await initializePool();
  const conn = await pool.getConnection();
  try {
    const hashed = bcrypt.hashSync(newPassword, 10);
    const [result] = await conn.execute('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);
    if (result.affectedRows === 0) {
      console.log(`No user updated. Is there a user with email ${email}?`);
    } else {
      console.log(`Password for ${email} updated.`);
    }
  } catch (err) {
    console.error('Error updating password:', err.message || err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

run();
