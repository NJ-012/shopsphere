import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let oracleEnabled = false;
let initError = null;

export async function initPool() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1,
      connectTimeout: 3
    });
    oracleEnabled = true;
    initError = null;
    console.log('Oracle pool created');
    return true;
  } catch (error) {
    oracleEnabled = false;
    initError = error;
    console.warn('Oracle unavailable, using mock datastore:', error.message);
    return false;
  }
}

export function isOracleAvailable() {
  return oracleEnabled;
}

export function getOracleInitError() {
  return initError;
}

export async function getConnection() {
  if (!oracleEnabled) {
    throw new Error('Oracle connection is not available');
  }
  return oracledb.getConnection();
}

export async function closePool() {
  if (!oracleEnabled) {
    return;
  }

  try {
    await oracledb.getPool().close(10);
  } finally {
    oracleEnabled = false;
  }
}

export async function executeQuery(sql, binds = [], options = {}) {
  const connection = await getConnection();
  try {
    return await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...options
    });
  } finally {
    await connection.close();
  }
}
