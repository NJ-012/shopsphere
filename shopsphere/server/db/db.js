import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let initError = null;

async function ensureSchema(dbPath) {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = await fs.readFile(schemaPath, 'utf-8');
  return new Promise((resolve, reject) => {
    db.exec(schemaSql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export async function initPool() {
  return new Promise((resolve) => {
    const dbPath = path.resolve(__dirname, 'shopsphere.sqlite');
    db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        initError = err;
        console.warn('SQLite unavailable:', err.message);
        resolve(false);
      } else {
        try {
          await ensureSchema(dbPath);
          initError = null;
          console.log('SQLite database active');
          resolve(true);
        } catch (schemaError) {
          initError = schemaError;
          console.error('Failed to initialize SQLite schema:', schemaError.message);
          resolve(false);
        }
      }
    });
  });
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
    beginTransaction: () => new Promise((resolve, reject) => db.run('BEGIN TRANSACTION', (err) => err ? reject(err) : resolve())),
    commit: () => new Promise((resolve, reject) => db.run('COMMIT', (err) => err ? reject(err) : resolve())),
    rollback: () => new Promise((resolve, reject) => db.run('ROLLBACK', (err) => err ? reject(err) : resolve())),
    execute: async (sql, binds = {}) => {
      const mappedBinds = {};
      for (const key of Object.keys(binds)) {
        mappedBinds[key.startsWith(':') ? key : `:${key}`] = binds[key];
      }

      return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          db.all(sql, mappedBinds, (err, rows) => {
            if (err) return reject(err);
            resolve([rows, []]);
          });
        } else {
          db.run(sql, mappedBinds, function(err) {
            if (err) return reject(err);
            resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
          });
        }
      });
    },
    release: () => {},
  };
}

export async function closePool() {
  if (db) {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) return reject(err);
        db = null;
        resolve();
      });
    });
  }
}

export async function executeQuery(sql, binds = {}) {
  if (!db) {
    throw new Error('SQLite database not initialized');
  }
  
  const mappedBinds = {};
  for (const key of Object.keys(binds)) {
    mappedBinds[key.startsWith(':') ? key : `:${key}`] = binds[key];
  }

  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, mappedBinds, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows });
      });
    } else {
      db.run(sql, mappedBinds, function(err) {
        if (err) return reject(err);
        resolve({ insertId: this.lastID, affectedRows: this.changes, rows: [] });
      });
    }
  });
}

