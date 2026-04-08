import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log('Connecting to embedded SQLite database...');
  
  const db = await open({
    filename: path.resolve(__dirname, 'shopsphere.sqlite'),
    driver: sqlite3.Database
  });

  try {
    console.log('Running schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await db.exec(schemaSql);
    
    console.log('Inserting product catalog...');

    // Clear existing data safely
    await db.exec('PRAGMA foreign_keys = OFF;');
    await db.run('DELETE FROM ORDER_ITEMS');
    await db.run('DELETE FROM ORDERS');
    await db.run('DELETE FROM PRODUCTS');
    await db.run('DELETE FROM CATEGORIES');
    await db.run('DELETE FROM VENDORS');
    await db.run('DELETE FROM USERS');
    try { await db.run('DELETE FROM sqlite_sequence'); } catch(e) {}
    await db.exec('PRAGMA foreign_keys = ON;');

    // Create one seeded vendor owner for catalog data.
    const vendorEmail = `catalog-owner-${Date.now()}@shopsphere.local`;
    const vendorPassword = crypto.randomBytes(24).toString('hex');
    const vendorHash = await bcrypt.hash(vendorPassword, 10);
    const vendorUserRes = await db.run(
      `INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, PHONE) VALUES (?, ?, ?, ?, ?)`,
      ['Catalog Owner', vendorEmail, vendorHash, 'VENDOR', '1234567890']
    );
    const vendorUserId = vendorUserRes.lastID;

    const vendorRes = await db.run(
      `INSERT INTO VENDORS (USER_ID, SHOP_NAME, IS_VERIFIED) VALUES (?, ?, ?)`,
      [vendorUserId, 'Official ShopSphere Store', 1]
    );
    const vendorId = vendorRes.lastID;

    // ─── Categories ───
    const categories = [
      { name: 'Electronics',   slug: 'electronics'   },
      { name: 'Fashion',       slug: 'fashion'       },
      { name: 'Home & Living', slug: 'home-living'   },
      { name: 'Sports',        slug: 'sports'        },
      { name: 'Accessories',   slug: 'accessories'   },
      { name: 'Gaming',        slug: 'gaming'        },
    ];

    const catIds = {};
    for (const cat of categories) {
      const res = await db.run(
        `INSERT INTO CATEGORIES (CAT_NAME, CAT_SLUG) VALUES (?, ?)`,
        [cat.name, cat.slug]
      );
      catIds[cat.slug] = res.lastID;
    }

    // ─── Products (≈120 items) ───
    const productTemplates = {
      electronics: [
        { name: 'UltraSlim Laptop', priceRange: [50000, 120000], keywords: 'laptop' },
        { name: 'Noise‑Canceling Headphones', priceRange: [3000, 15000], keywords: 'headphones' },
        { name: '4K Curved Monitor', priceRange: [25000, 60000], keywords: 'monitor' },
        { name: 'Smartphone Pro Max', priceRange: [20000, 80000], keywords: 'smartphone' },
        { name: 'Wireless Earbuds', priceRange: [1500, 8000], keywords: 'earbuds' },
        { name: 'Portable Bluetooth Speaker', priceRange: [2000, 10000], keywords: 'speaker' },
        { name: 'Gaming Keyboard', priceRange: [3000, 12000], keywords: 'keyboard' },
        { name: 'Mechanical Gaming Mouse', priceRange: [1500, 7000], keywords: 'mouse' },
        { name: 'Smartwatch Series 5', priceRange: [8000, 25000], keywords: 'smartwatch' },
        { name: 'External SSD 1TB', priceRange: [6000, 15000], keywords: 'ssd' },
      ],
      fashion: [
        { name: 'Classic Denim Jacket', priceRange: [3000, 8000], keywords: 'denim jacket' },
        { name: 'Graphic T‑Shirt', priceRange: [500, 1500], keywords: 'tshirt' },
        { name: 'Slim Fit Chinos', priceRange: [1200, 3000], keywords: 'chinos' },
        { name: 'Silk Evening Dress', priceRange: [5000, 15000], keywords: 'dress' },
        { name: 'Wool Blend Overcoat', priceRange: [8000, 20000], keywords: 'overcoat' },
        { name: 'Athleisure Hoodie', priceRange: [1500, 4000], keywords: 'hoodie' },
        { name: 'Leather Handbag', priceRange: [4000, 12000], keywords: 'handbag' },
        { name: 'Stainless Steel Watch', priceRange: [5000, 20000], keywords: 'watch' },
        { name: 'Sunglasses Polarized', priceRange: [800, 2500], keywords: 'sunglasses' },
        { name: 'Minimalist Wallet', priceRange: [500, 1500], keywords: 'wallet' },
      ],
      "home-living": [
        { name: 'Smart Coffee Maker', priceRange: [6000, 15000], keywords: 'coffee maker' },
        { name: 'Ceramic Table Lamp', priceRange: [1200, 3500], keywords: 'lamp' },
        { name: 'Bamboo Bed Frame', priceRange: [15000, 30000], keywords: 'bed frame' },
        { name: 'Aromatherapy Diffuser', priceRange: [800, 2500], keywords: 'diffuser' },
        { name: 'Velvet Throw Pillows', priceRange: [500, 2000], keywords: 'pillows' },
        { name: 'Modern Wall Art', priceRange: [2000, 8000], keywords: 'wall art' },
        { name: 'LED Floor Lamp', priceRange: [3000, 9000], keywords: 'floor lamp' },
        { name: 'Organic Cotton Blanket', priceRange: [1500, 4000], keywords: 'blanket' },
        { name: 'Smart Thermostat', priceRange: [5000, 12000], keywords: 'thermostat' },
        { name: 'Air Purifier', priceRange: [7000, 18000], keywords: 'air purifier' },
      ],
      sports: [
        { name: 'Carbon Fiber Road Bike', priceRange: [50000, 120000], keywords: 'bike' },
        { name: 'Running Shoes', priceRange: [3000, 9000], keywords: 'running shoes' },
        { name: 'Yoga Mat Premium', priceRange: [800, 2500], keywords: 'yoga mat' },
        { name: 'Adjustable Dumbbell Set', priceRange: [8000, 20000], keywords: 'dumbbell' },
        { name: 'Fitness Tracker', priceRange: [3000, 10000], keywords: 'fitness tracker' },
        { name: 'Resistance Bands Set', priceRange: [500, 1500], keywords: 'resistance bands' },
        { name: 'Sports Water Bottle', priceRange: [300, 800], keywords: 'water bottle' },
        { name: 'Gym Backpack', priceRange: [1200, 3500], keywords: 'backpack' },
        { name: 'Boxing Gloves', priceRange: [1500, 4000], keywords: 'boxing gloves' },
        { name: 'Tennis Racket', priceRange: [2500, 8000], keywords: 'tennis racket' },
      ],
      accessories: [
        { name: 'Leather Crossbody Bag', priceRange: [4000, 12000], keywords: 'crossbody bag' },
        { name: 'Titanium Wristwatch', priceRange: [8000, 25000], keywords: 'watch' },
        { name: 'Polarized Sunglasses', priceRange: [800, 2500], keywords: 'sunglasses' },
        { name: 'Silk Pocket Square Set', priceRange: [500, 1500], keywords: 'pocket square' },
        { name: 'Minimalist Wallet', priceRange: [500, 1500], keywords: 'wallet' },
        { name: 'Bluetooth Earbuds', priceRange: [1500, 5000], keywords: 'earbuds' },
        { name: 'Travel Organizer', priceRange: [800, 2000], keywords: 'organizer' },
        { name: 'Phone Case Premium', priceRange: [300, 1000], keywords: 'phone case' },
        { name: 'Keychain Leather', priceRange: [200, 600], keywords: 'keychain' },
        { name: 'USB‑C Hub', priceRange: [1500, 4000], keywords: 'usb hub' },
      ],
      gaming: [
        { name: 'Pro Gaming Controller', priceRange: [3000, 8000], keywords: 'controller' },
        { name: 'RGB Mechanical Keyboard', priceRange: [5000, 15000], keywords: 'keyboard' },
        { name: 'Ultra‑Wide Gaming Monitor', priceRange: [40000, 90000], keywords: 'monitor' },
        { name: 'Streaming Microphone', priceRange: [3000, 8000], keywords: 'microphone' },
        { name: 'VR Headset Elite', priceRange: [30000, 70000], keywords: 'vr headset' },
        { name: 'Gaming Chair Ergonomic', priceRange: [15000, 35000], keywords: 'gaming chair' },
        { name: 'High‑Performance GPU', priceRange: [40000, 120000], keywords: 'gpu' },
        { name: 'Gaming Laptop', priceRange: [60000, 150000], keywords: 'gaming laptop' },
        { name: 'RGB Mouse Pad', priceRange: [500, 1500], keywords: 'mouse pad' },
        { name: 'Game Capture Card', priceRange: [3000, 8000], keywords: 'capture card' },
      ],
    };

    const products = [];
    for (const [cat, templates] of Object.entries(productTemplates)) {
      for (let i = 0; i < 20; i++) {
        const tmpl = templates[i % templates.length];
        const price = Math.floor(Math.random() * (tmpl.priceRange[1] - tmpl.priceRange[0] + 1)) + tmpl.priceRange[0];
        const discount = Math.random() < 0.25 ? Math.floor(Math.random() * 30) + 5 : 0;
        const featured = Math.random() < 0.15;
        const desc = `Premium ${tmpl.name.toLowerCase()} with high quality materials and excellent performance.`;
        const image = `https://source.unsplash.com/seed/${cat}-${i}/${800}x${800}?${encodeURIComponent(tmpl.keywords)}`;
        products.push({
          cat,
          name: `${tmpl.name} ${i + 1}`,
          price,
          image,
          featured,
          discount,
          desc,
        });
      }
    }

    for (const prod of products) {
      await db.run(
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

    console.log(`Seeding completed! ${products.length} products created across ${categories.length} categories.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await db.close();
  }
}

seed();
