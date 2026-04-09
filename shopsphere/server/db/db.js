import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let initError = null;

export async function initPool() {
  try {
    db = await open({
      filename: path.resolve(__dirname, 'shopsphere.sqlite'),
      driver: sqlite3.Database
    });
    // Test connection
    await db.get('SELECT 1');
    initError = null;
    console.log('SQLite database active');
    return true;
  } catch (error) {
    initError = error;
    console.warn('SQLite unavailable:', error.message);
    return false;
  }
}

export function isDbAvailable() {
  return db !== null && initError === null;
}

export function getDbInitError() {
  return initError;
}

export async function getConnection() {
  if (!db) {
    throw new Error('SQLite database is not available');
  }
  return {
    beginTransaction: async () => await db.run('BEGIN TRANSACTION'),
    commit: async () => await db.run('COMMIT'),
    rollback: async () => await db.run('ROLLBACK'),
    execute: async (sql, binds = {}) => {
      // Map bind properties to include the colon if using an object map
      const mappedBinds = {};
      for (const key of Object.keys(binds)) {
        mappedBinds[key.startsWith(':') ? key : `:${key}`] = binds[key];
      }

      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await db.all(sql, mappedBinds);
        return [rows, []];
      } else {
        const result = await db.run(sql, mappedBinds);
        return [{ insertId: result.lastID, affectedRows: result.changes }];
      }
    },
    release: () => {},
  };
}

export async function closePool() {
  if (db) {
    await db.close();
    db = null;
  }
}

export async function executeQuery(sql, binds = {}) {
  if (!db) {
    throw new Error('SQLite database not initialized');
  }
  
  // Format bind parameters mapping key -> :key for sqlite3
  const mappedBinds = {};
  for (const key of Object.keys(binds)) {
    mappedBinds[key.startsWith(':') ? key : `:${key}`] = binds[key];
  }

  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const rows = await db.all(sql, mappedBinds);
    return { rows };
  } else {
    const result = await db.run(sql, mappedBinds);
    return { insertId: result.lastID, affectedRows: result.changes, rows: [] };
  }
}

