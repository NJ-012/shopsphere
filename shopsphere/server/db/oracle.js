const oracledb = require('oracledb');

// Initialize pool
async function initOracle() {
  try {
    await oracledb.createPool({
      user: 'shopsphere',
      password: 'Shop1234',
      connectString: 'localhost:1521/xe',
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Oracle pool created');
  } catch (err) {
    console.error('Oracle init error:', err);
  }
}

// Simple query
async function query(sql, binds = [], opts = {}) {
  let conn;
  try {
    conn = await oracledb.getConnection();
    const result = await conn.execute(
      sql, 
      binds, 
      { 
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        ...opts 
      }
    );
    return result.rows;
  } catch (err) {
    console.error('Query error:', err);
    return [];
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('Close error:', err);
      }
    }
  }
}

// Export
module.exports = { initOracle, query };

// Usage:
// await initOracle();
// const users = await query('SELECT * FROM users WHERE id = :id', [123]);

// Run at startup: server.js require('./db/oracle').initOracle();
