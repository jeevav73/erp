const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

const initializePool = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('Connected to MySQL database');
  }
  return pool;
};

const runQuery = async (query, params = []) => {
  const poolInstance = await initializePool();
  const connection = await poolInstance.getConnection();
  try {
    const [result] = await connection.execute(query, params);
    return { id: result.insertId, changes: result.affectedRows };
  } finally {
    connection.release();
  }
};

const getQuery = async (query, params = []) => {
  const poolInstance = await initializePool();
  const connection = await poolInstance.getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows[0] || null;
  } finally {
    connection.release();
  }
};

const allQuery = async (query, params = []) => {
  const poolInstance = await initializePool();
  const connection = await poolInstance.getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } finally {
    connection.release();
  }
};

const closeDatabase = async () => {
  if (pool) {
    await pool.end();
    console.log('Database connection pool closed');
  }
};

module.exports = {
  initializePool,
  runQuery,
  getQuery,
  allQuery,
  closeDatabase
};
