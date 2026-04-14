import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'db', 'shopsphere.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the shopsphere database at ' + dbPath);
});

db.run("UPDATE PRODUCTS SET IMAGE_URL = NULL WHERE IMAGE_URL LIKE 'https://source.unsplash.com%' OR IMAGE_URL LIKE '%252C%'", function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);
});

db.close();
