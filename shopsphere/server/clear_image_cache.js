import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'db', 'shopsphere.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Connecting to database:', dbPath);

db.serialize(() => {
  // Clear IMAGE_URL for any products that have been 'cached' with a pollinations URL
  db.run(
    "UPDATE PRODUCTS SET IMAGE_URL = NULL WHERE IMAGE_URL LIKE '%pollinations.ai%'",
    function(err) {
      if (err) {
        console.error('Error purging cache:', err.message);
      } else {
        console.log(`Successfully purged cache. Rows affected: ${this.changes}`);
        console.log('All Pollinations URLs have been reset to NULL. The server will re-resolve them on next request.');
      }
    }
  );
});

db.close();
