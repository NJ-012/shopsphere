import { initPool, isDbAvailable, executeQuery, getDbInitError } from './db.js';

export async function initOracle() {
  return initPool();
}

export { isDbAvailable, executeQuery, getDbInitError };
