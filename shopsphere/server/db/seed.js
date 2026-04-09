import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log('Connecting to embedded SQLite database...');
  
  const dbPath = path.resolve(__dirname, 'shopsphere.sqlite');
  const db = new sqlite3.Database(dbPath);

  // Helper to wrap db.run/exec in promises
  const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

  const exec = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (err) => err ? reject(err) : resolve());
  });

  try {
    console.log('Running schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await exec(schemaSql);
    
    console.log('Inserting product catalog...');

    // Clear existing data safely
    await exec('PRAGMA foreign_keys = OFF;');
    await run('DELETE FROM ORDER_ITEMS');
    await run('DELETE FROM ORDERS');
    await run('DELETE FROM PRODUCTS');
    await run('DELETE FROM CATEGORIES');
    await run('DELETE FROM VENDORS');
    await run('DELETE FROM USERS');
    try { await run('DELETE FROM sqlite_sequence'); } catch(e) {}
    await exec('PRAGMA foreign_keys = ON;');

    // Create one seeded vendor owner for catalog data.
    const vendorEmail = `catalog-owner-${Date.now()}@shopsphere.local`;
    const vendorPassword = crypto.randomBytes(24).toString('hex');
    const vendorHash = await bcrypt.hash(vendorPassword, 10);
    const vendorUserRes = await run(
      `INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, PHONE) VALUES (?, ?, ?, ?, ?)`,
      ['Catalog Owner', vendorEmail, vendorHash, 'VENDOR', '1234567890']
    );
    const vendorUserId = vendorUserRes.lastID;

    const vendorRes = await run(
      `INSERT INTO VENDORS (USER_ID, SHOP_NAME, IS_VERIFIED) VALUES (?, ?, ?)`,
      [vendorUserId, 'Official ShopSphere Store', 1]
    );
    const vendorId = vendorRes.lastID;

    // ─── Categories ───
    const categories = [
      { name: 'Electronics',   slug: 'electronics',   image: '/images/laptop.png'     },
      { name: 'Fashion',       slug: 'fashion',       image: '/images/jacket.png'      },
      { name: 'Home & Living', slug: 'home-living',   image: '/images/coffee.png'      },
      { name: 'Sports',        slug: 'sports',        image: '/images/tee.png'         },
      { name: 'Accessories',   slug: 'accessories',   image: '/images/monitor.png'    },
      { name: 'Gaming',        slug: 'gaming',        image: '/images/controller.png'  },
    ];

    const catIds = {};
    const catImages = {};
    for (const cat of categories) {
      const res = await run(
        `INSERT INTO CATEGORIES (CAT_NAME, CAT_SLUG) VALUES (?, ?)`,
        [cat.name, cat.slug]
      );
      catIds[cat.slug] = res.lastID;
      catImages[cat.slug] = cat.image;
    }

    // ─── Products (≈120 items) ───
    // ... (templates omitted for brevity, but I'll update the loop below)
    const productTemplates = {
      electronics: [
        { name: 'UltraSlim Laptop', priceRange: [50000, 120000], image: '/images/laptop.png' },
        { name: 'Wireless Earbuds', priceRange: [1500, 8000], image: '/images/earbuds.png' },
        { name: '4K Curved Monitor', priceRange: [25000, 60000], image: '/images/monitor.png' },
      ],
      fashion: [
        { name: 'Classic Denim Jacket', priceRange: [3000, 8000], image: '/images/jacket.png' },
        { name: 'Graphic T‑Shirt', priceRange: [500, 1500], image: '/images/tee.png' },
      ],
      "home-living": [
        { name: 'Smart Coffee Maker', priceRange: [6000, 15000], image: '/images/coffee.png' },
        { name: 'Mechanical Keyboard', priceRange: [3000, 12000], image: '/images/keyboard.png' },
      ],
      sports: [
        { name: 'Running Shoes', priceRange: [3000, 9000], image: '/images/tee.png' },
        { name: 'Gym Backpack', priceRange: [1200, 3500], image: '/images/jacket.png' },
      ],
      accessories: [
        { name: 'Leather Crossbody Bag', priceRange: [4000, 12000], image: '/images/jacket.png' },
        { name: 'Titanium Wristwatch', priceRange: [8000, 25000], image: '/images/monitor.png' },
      ],
      gaming: [
        { name: 'Pro Gaming Controller', priceRange: [3000, 8000], image: '/images/controller.png' },
        { name: 'RGB Mechanical Keyboard', priceRange: [5000, 15000], image: '/images/keyboard.png' },
      ],
    };

    const products = [];
    let globalIndex = 0;
    for (const [cat, templates] of Object.entries(productTemplates)) {
      for (let i = 0; i < 8; i++) {
        const tmpl = templates[i % templates.length];
        const price = Math.floor(Math.random() * (tmpl.priceRange[1] - tmpl.priceRange[0] + 1)) + tmpl.priceRange[0];
        const discount = Math.random() < 0.25 ? Math.floor(Math.random() * 30) + 5 : 0;
        const featured = Math.random() < 0.15;
        const desc = `Premium ${tmpl.name.toLowerCase()} with high quality materials and excellent performance.`;
        
        products.push({
          cat,
          name: `${tmpl.name} ${i + 1}`,
          price,
          image: tmpl.image || catImages[cat] || '/images/laptop.png',
          featured,
          discount,
          desc,
        });
        globalIndex++;
      }
    }

    for (const prod of products) {
      await run(
        `INSERT INTO PRODUCTS (VENDOR_ID, CAT_ID, PROD_NAME, DESCRIPTION, PRICE, STOCK_QTY, RATING, REVIEW_COUNT, IMAGE_URL, DISCOUNT_PCT, IS_FEATURED)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vendorId,
          catIds[prod.cat],
          prod.name,
          prod.desc,
          prod.price,
          Math.floor(Math.random() * 200) + 10,
          parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5–5.0
          Math.floor(Math.random() * 800) + 20,
          prod.image,
          prod.discount || 0,
          prod.featured ? 1 : 0
        ]
      );
    }

    console.log(`Seeding completed! ${products.length} products created using local assets.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    db.close();
  }
}

seed();
