import { initPool } from './db/db.js';
import { getAllProducts } from './db/queries.js';

async function test() {
  await initPool();
  try {
    const products = await getAllProducts({ featured: true, limit: 8 });
    console.log('Success:', products);
  } catch (err) {
    console.error('TEST ERROR:', err);
  }
  process.exit(0);
}
test();
