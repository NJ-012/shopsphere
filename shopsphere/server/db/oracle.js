import { initPool, isOracleAvailable, executeQuery, getOracleInitError } from './db.js';

export async function initOracle() {
  return initPool();
}

export { isOracleAvailable, executeQuery, getOracleInitError };
