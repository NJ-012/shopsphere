import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let initError = null;

export async function initPool() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true,
    });
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    initError = null;
    console.log('MySQL database active');
    return true;
  } catch (error) {
    initError = error;
    console.warn('MySQL unavailable:', error.message);
    return false;
  }
}

export function isDbAvailable() {
  return pool !== null && initError === null;
}

export function getDbInitError() {
  return initError;
}

export async function getConnection() {
  if (!pool) {
    throw new Error('MySQL database is not available');
  }
  const connection = await pool.getConnection();
  // Provide a compatible API for existing code
  return {
    beginTransaction: () => connection.beginTransaction(),
    commit: () => connection.commit(),
    rollback: () => connection.rollback(),
    execute: async (sql, binds = {}) => {
      const [rows, fields] = await connection.execute(sql, Object.values(binds));
      // For SELECT return rows array, for INSERT/UPDATE return result info
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        return [rows];
      } else {
        // rows is ResultSetHeader for non-select
        return [{ insertId: rows.insertId, affectedRows: rows.affectedRows }];
      }
    },
    release: () => connection.release(),
  };
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function executeQuery(sql, binds = {}) {
  if (!pool) {
    throw new Error('MySQL database not initialized');
  }
  const [rows] = await pool.execute(sql, Object.values(binds));
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    return { rows };
  } else {
    return { insertId: rows.insertId, affectedRows: rows.affectedRows, rows: [] };
  }
}
