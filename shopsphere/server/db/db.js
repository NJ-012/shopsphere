import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function initPool() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2,
    });
    console.log('Oracle pool created');
  } catch (err) {
    console.error('Error creating pool:', err);
    throw err;
  }
}

export async function getConnection() {
  return await oracledb.getConnection();
}

export async function closePool() {
  await oracledb.getPool().close(10);
}

export async function executeQuery(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      sql,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT, ...options }
    );
    return result;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

