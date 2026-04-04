import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'mock-db.json');

const sampleProducts = [
  {
    prod_id: 1,
    prod_name: 'Premium Cotton T-Shirt',
    cat_name: 'T-Shirts',
    cat_slug: 't-shirts',
    price: 799,
    rating: 4.5,
    review_count: 127,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    discount_pct: 10,
    shop_name: 'Trendy Wear',
    stock_qty: 50,
    is_featured: true,
    try_on_enabled: true,
    description: 'Soft combed cotton t-shirt with a relaxed cut and premium stitching.'
  },
  {
    prod_id: 2,
    prod_name: 'Slim Fit Jeans',
    cat_name: 'Jeans',
    cat_slug: 'jeans',
    price: 1599,
    rating: 4.8,
    review_count: 89,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
    discount_pct: 0,
    shop_name: 'Urban Denim',
    stock_qty: 25,
    is_featured: true,
    try_on_enabled: false,
    description: 'Structured slim-fit denim crafted for everyday wear and easy pairing.'
  },
  {
    prod_id: 3,
    prod_name: 'Classic Sneakers',
    cat_name: 'Sneakers',
    cat_slug: 'sneakers',
    price: 1299,
    rating: 4.3,
    review_count: 156,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    discount_pct: 15,
    shop_name: 'Street Style',
    stock_qty: 38,
    is_featured: true,
    try_on_enabled: false,
    description: 'Everyday sneakers with cushioned soles and a clean streetwear silhouette.'
  },
  {
    prod_id: 4,
    prod_name: 'Oversized Hoodie',
    cat_name: 'Hoodies',
    cat_slug: 'hoodies',
    price: 1199,
    rating: 4.7,
    review_count: 203,
    image_url: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=900&q=80',
    discount_pct: 5,
    shop_name: 'Cozy Wear',
    stock_qty: 42,
    is_featured: true,
    try_on_enabled: true,
    description: 'Heavyweight fleece hoodie with a roomy fit and brushed interior comfort.'
  },
  {
    prod_id: 5,
    prod_name: 'Floral Summer Dress',
    cat_name: 'Dresses',
    cat_slug: 'dresses',
    price: 1899,
    rating: 4.6,
    review_count: 74,
    image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    discount_pct: 12,
    shop_name: 'Blossom Lane',
    stock_qty: 18,
    is_featured: false,
    try_on_enabled: true,
    description: 'Printed midi dress designed with lightweight fabric and soft movement.'
  },
  {
    prod_id: 6,
    prod_name: 'Structured Blazer',
    cat_name: 'Jackets',
    cat_slug: 'jackets',
    price: 2499,
    rating: 4.9,
    review_count: 41,
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    discount_pct: 8,
    shop_name: 'Boardroom Edit',
    stock_qty: 14,
    is_featured: false,
    try_on_enabled: true,
    description: 'Tailored blazer with a modern shoulder line and smooth satin lining.'
  },
  {
    prod_id: 7,
    prod_name: 'Weekend Tote Bag',
    cat_name: 'Accessories',
    cat_slug: 'accessories',
    price: 999,
    rating: 4.2,
    review_count: 65,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    discount_pct: 0,
    shop_name: 'Carry Co.',
    stock_qty: 31,
    is_featured: false,
    try_on_enabled: false,
    description: 'Canvas tote bag with reinforced handles and a laptop-friendly main compartment.'
  },
  {
    prod_id: 8,
    prod_name: 'Layered Gold Necklace',
    cat_name: 'Accessories',
    cat_slug: 'accessories',
    price: 699,
    rating: 4.4,
    review_count: 93,
    image_url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
    discount_pct: 20,
    shop_name: 'Lustre Studio',
    stock_qty: 64,
    is_featured: true,
    try_on_enabled: false,
    description: 'Minimal layered necklace set built for stacking or standalone styling.'
  }
];

async function buildInitialStore() {
  const passwordHash = await bcrypt.hash('password123', 10);
  return {
    meta: {
      lastUpdated: new Date().toISOString()
    },
    users: [
      {
        user_id: 1,
        full_name: 'Niyati Joshi',
        email: 'customer@shopsphere.com',
        password_hash: passwordHash,
        role: 'CUSTOMER',
        phone: '9876543210',
        avatar_url: '',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        user_id: 2,
        full_name: 'Aarav Merchant',
        email: 'vendor@shopsphere.com',
        password_hash: passwordHash,
        role: 'VENDOR',
        phone: '9988776655',
        avatar_url: '',
        is_active: true,
        shop_name: 'Urban Denim',
        is_verified: true,
        created_at: new Date().toISOString()
      },
      {
        user_id: 3,
        full_name: 'Admin User',
        email: 'admin@shopsphere.com',
        password_hash: passwordHash,
        role: 'ADMIN',
        phone: '9000000000',
        avatar_url: '',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ],
    products: sampleProducts,
    orders: [
      {
        order_id: 1,
        user_id: 1,
        address: {
          full_name: 'Niyati Joshi',
          line1: '221B Fashion Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          postal_code: '400001',
          phone: '9876543210'
        },
        items: [
          {
            prod_id: 1,
            quantity: 1,
            unit_price: 799,
            prod_name: 'Premium Cotton T-Shirt',
            image_url: sampleProducts[0].image_url,
            shop_name: sampleProducts[0].shop_name
          },
          {
            prod_id: 8,
            quantity: 1,
            unit_price: 699,
            prod_name: 'Layered Gold Necklace',
            image_url: sampleProducts[7].image_url,
            shop_name: sampleProducts[7].shop_name
          }
        ],
        total_amount: 1498,
        discount_amount: 139,
        delivery_charge: 0,
        final_amount: 1359,
        payment_status: 'PAID',
        payment_method: 'RAZORPAY',
        status: 'CONFIRMED',
        created_at: new Date().toISOString()
      }
    ]
  };
}

let storeCache;
let writeQueue = Promise.resolve();

async function ensureStoreFile() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    const initialStore = await buildInitialStore();
    await fs.writeFile(STORE_PATH, JSON.stringify(initialStore, null, 2));
  }
}

export async function getStore() {
  if (storeCache) {
    return storeCache;
  }

  await ensureStoreFile();
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  storeCache = JSON.parse(raw);
  return storeCache;
}

export async function saveStore(store) {
  store.meta = {
    ...store.meta,
    lastUpdated: new Date().toISOString()
  };
  storeCache = store;
  writeQueue = writeQueue.then(() => fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2)));
  await writeQueue;
  return store;
}

export async function mutateStore(mutator) {
  const current = await getStore();
  const clone = JSON.parse(JSON.stringify(current));
  const updated = await mutator(clone);
  return saveStore(updated || clone);
}

export function nextId(collection, key) {
  return collection.reduce((max, item) => Math.max(max, Number(item[key]) || 0), 0) + 1;
}
