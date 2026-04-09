import { executeQuery, getConnection, isDbAvailable } from './db.js';

function firstRow(result) {
  if (Array.isArray(result?.rows)) {
    return result.rows.length > 0 ? result.rows[0] : null;
  }
  return null;
}

function normalizeRows(result) {
  return Array.isArray(result?.rows) ? result.rows : [];
}

export { isDbAvailable };

export async function testConnection() {
  if (!isDbAvailable()) {
    throw new Error('Database not available');
  }

  const result = await executeQuery('SELECT 1 AS TEST');
  return firstRow(result);
}

export async function getUserByEmail(email) {
  const result = await executeQuery(
    `SELECT
      u.USER_ID,
      u.FULL_NAME,
      u.EMAIL,
      u.PASSWORD_HASH,
      u.ROLE,
      u.CREATED_AT,
      v.VENDOR_ID,
      v.SHOP_NAME,
      v.IS_VERIFIED
    FROM USERS u
    LEFT JOIN VENDORS v ON u.USER_ID = v.USER_ID
    WHERE LOWER(u.EMAIL) = LOWER(:email)`,
    { email }
  );

  return firstRow(result);
}

export async function getUserById(userId) {
  const result = await executeQuery(
    `SELECT
      u.USER_ID,
      u.FULL_NAME,
      u.EMAIL,
      u.PASSWORD_HASH,
      u.ROLE,
      u.CREATED_AT,
      v.VENDOR_ID,
      v.SHOP_NAME,
      v.IS_VERIFIED
    FROM USERS u
    LEFT JOIN VENDORS v ON u.USER_ID = v.USER_ID
    WHERE u.USER_ID = :userId`,
    { userId }
  );

  return firstRow(result);
}

export async function createUser(fullName, email, passwordHash, role, phone = '') {
  const result = await executeQuery(
    `INSERT INTO USERS (FULL_NAME, EMAIL, PASSWORD_HASH, ROLE, PHONE)
     VALUES (:fullName, :email, :passwordHash, :role, :phone)`,
    { fullName, email, passwordHash, role, phone }
  );
  return result.insertId;
}

export async function createVendor(userId, shopName, isVerified = 0) {
  const result = await executeQuery(
    `INSERT INTO VENDORS (USER_ID, SHOP_NAME, IS_VERIFIED)
     VALUES (:userId, :shopName, :isVerified)`,
    { userId, shopName, isVerified }
  );
  return result.insertId;
}

export async function getAllProducts({
  category = '',
  search = '',
  featured = false,
  limit = 50,
} = {}) {
  let sql = `
    SELECT
      p.PROD_ID,
      p.PROD_NAME,
      p.DESCRIPTION,
      p.PRICE,
      p.STOCK_QTY,
      p.RATING,
      p.REVIEW_COUNT,
      p.IMAGE_URL,
      p.DISCOUNT_PCT,
      p.IS_ACTIVE,
      v.SHOP_NAME,
      c.CAT_NAME,
      c.CAT_SLUG
    FROM PRODUCTS p
    JOIN VENDORS v ON p.VENDOR_ID = v.VENDOR_ID
    JOIN CATEGORIES c ON p.CAT_ID = c.CAT_ID
    WHERE p.IS_ACTIVE = 1
  `;
  const binds = {};
  let currentLimit = Number(limit) || 50;

  if (featured) {
    sql += ` AND IFNULL(p.IS_FEATURED, 0) = 1`;
  }

  if (category) {
    // Exact match for category
    sql += ` AND LOWER(c.CAT_SLUG) = LOWER(:category)`;
    binds.category = category;
  }

  if (search) {
    sql += ` AND (
      LOWER(p.PROD_NAME) LIKE LOWER(:search)
      OR LOWER(IFNULL(p.DESCRIPTION, '')) LIKE LOWER(:search)
      OR LOWER(v.SHOP_NAME) LIKE LOWER(:search)
    )`;
    binds.search = `%${search}%`;
  }

  sql += ` ORDER BY IFNULL(p.RATING, 0) DESC, IFNULL(p.REVIEW_COUNT, 0) DESC LIMIT :limit`;
  binds.limit = currentLimit;

  const result = await executeQuery(sql, binds);
  return normalizeRows(result);
}

export async function getProductById(prodId) {
  const result = await executeQuery(
    `SELECT
      p.PROD_ID,
      p.PROD_NAME,
      p.DESCRIPTION,
      p.PRICE,
      p.STOCK_QTY,
      p.RATING,
      p.REVIEW_COUNT,
      p.IMAGE_URL,
      p.DISCOUNT_PCT,
      p.IS_ACTIVE,
      p.VENDOR_ID,
      v.SHOP_NAME,
      c.CAT_NAME,
      c.CAT_SLUG
    FROM PRODUCTS p
    JOIN VENDORS v ON p.VENDOR_ID = v.VENDOR_ID
    JOIN CATEGORIES c ON p.CAT_ID = c.CAT_ID
    WHERE p.PROD_ID = :prodId`,
    { prodId }
  );

  return firstRow(result);
}

export async function createProduct({ vendor_id, cat_id, prod_name, description, price, stock_qty, image_url, discount_pct = 0 }) {
  const result = await executeQuery(
    `INSERT INTO PRODUCTS (VENDOR_ID, CAT_ID, PROD_NAME, DESCRIPTION, PRICE, STOCK_QTY, IMAGE_URL, DISCOUNT_PCT, RATING, REVIEW_COUNT)
     VALUES (:vendor_id, :cat_id, :prod_name, :description, :price, :stock_qty, :image_url, :discount_pct, 4.0, 0)`,
    { vendor_id, cat_id, prod_name, description, price, stock_qty, image_url, discount_pct }
  );
  return result.insertId;
}

export async function updateProduct(prodId, { cat_id, prod_name, description, price, stock_qty, image_url, discount_pct }) {
  await executeQuery(
    `UPDATE PRODUCTS
     SET CAT_ID = :cat_id,
         PROD_NAME = :prod_name,
         DESCRIPTION = :description,
         PRICE = :price,
         STOCK_QTY = :stock_qty,
         IMAGE_URL = :image_url,
         DISCOUNT_PCT = :discount_pct
     WHERE PROD_ID = :prodId`,
    { prodId, cat_id, prod_name, description, price, stock_qty, image_url, discount_pct }
  );
}

export async function deleteProduct(prodId) {
  await executeQuery(`DELETE FROM PRODUCTS WHERE PROD_ID = :prodId`, { prodId });
}

export async function getVendorProducts(vendorId) {
  const result = await executeQuery(
    `SELECT p.*, c.CAT_NAME FROM PRODUCTS p
     JOIN CATEGORIES c ON p.CAT_ID = c.CAT_ID
     WHERE p.VENDOR_ID = :vendorId`,
    { vendorId }
  );
  return normalizeRows(result);
}

// Admin queries
export async function adminGetAllUsers() {
  const result = await executeQuery(`SELECT USER_ID, FULL_NAME, EMAIL, ROLE, CREATED_AT FROM USERS`);
  return normalizeRows(result);
}

export async function adminGetAllVendors() {
  const result = await executeQuery(
    `SELECT v.VENDOR_ID, v.SHOP_NAME, u.FULL_NAME, u.EMAIL, v.IS_VERIFIED 
     FROM VENDORS v 
     JOIN USERS u ON v.USER_ID = u.USER_ID`
  );
  return normalizeRows(result);
}

export async function adminGetAllOrders() {
  const result = await executeQuery(
    `SELECT o.*, u.FULL_NAME as CUSTOMER_NAME 
     FROM ORDERS o 
     JOIN USERS u ON o.CUSTOMER_ID = u.USER_ID 
     ORDER BY o.ORDERED_AT DESC`
  );
  return normalizeRows(result);
}

export async function getCategories() {
  const result = await executeQuery(
    `SELECT
      c.CAT_ID,
      c.CAT_NAME,
      c.CAT_SLUG,
      COUNT(p.PROD_ID) AS PRODUCT_COUNT
    FROM CATEGORIES c
    LEFT JOIN PRODUCTS p
      ON c.CAT_ID = p.CAT_ID
      AND p.IS_ACTIVE = 1
    GROUP BY c.CAT_ID, c.CAT_NAME, c.CAT_SLUG
    ORDER BY c.CAT_NAME`
  );

  return normalizeRows(result);
}

export async function createOrder(customerId, items, address, totals) {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO ORDERS (
        CUSTOMER_ID,
        TOTAL_AMOUNT,
        DISCOUNT_AMOUNT,
        DELIVERY_CHARGE,
        FINAL_AMOUNT,
        PAYMENT_STATUS,
        ORDER_STATUS,
        ADDRESS_LINE1,
        CITY,
        STATE,
        POSTAL_CODE,
        CONTACT_PHONE
      ) VALUES (
        :customerId,
        :totalAmount,
        :discountAmount,
        :deliveryCharge,
        :finalAmount,
        'PENDING',
        'PENDING',
        :line1,
        :city,
        :state,
        :postalCode,
        :phone
      )`,
      {
        customerId,
        totalAmount: totals.totalAmount,
        discountAmount: totals.discountAmount,
        deliveryCharge: totals.deliveryCharge,
        finalAmount: totals.finalAmount,
        line1: address.line1 || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postal_code || '',
        phone: address.phone || '',
      }
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.execute(
        `INSERT INTO ORDER_ITEMS (ORDER_ID, PROD_ID, QUANTITY, UNIT_PRICE)
         VALUES (:orderId, :prodId, :quantity, :unitPrice)`,
        {
          orderId,
          prodId: item.prod_id,
          quantity: item.quantity,
          unitPrice: item.unit_price,
        }
      );

      await connection.execute(
        `UPDATE PRODUCTS
         SET STOCK_QTY = STOCK_QTY - :quantity
         WHERE PROD_ID = :prodId`,
        { quantity: item.quantity, prodId: item.prod_id }
      );
    }

    await connection.commit();
    return { order_id: orderId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getUserOrders(userId) {
  const result = await executeQuery(
    `SELECT
      o.ORDER_ID,
      o.CUSTOMER_ID,
      o.TOTAL_AMOUNT,
      o.DISCOUNT_AMOUNT,
      o.DELIVERY_CHARGE,
      o.FINAL_AMOUNT,
      o.PAYMENT_STATUS,
      o.ORDER_STATUS,
      o.ADDRESS_LINE1,
      o.CITY,
      o.STATE,
      o.POSTAL_CODE,
      o.CONTACT_PHONE,
      o.ORDERED_AT,
      COUNT(oi.ITEM_ID) AS ITEM_COUNT
    FROM ORDERS o
    LEFT JOIN ORDER_ITEMS oi ON o.ORDER_ID = oi.ORDER_ID
    WHERE o.CUSTOMER_ID = :userId
    GROUP BY
      o.ORDER_ID,
      o.CUSTOMER_ID,
      o.TOTAL_AMOUNT,
      o.DISCOUNT_AMOUNT,
      o.DELIVERY_CHARGE,
      o.FINAL_AMOUNT,
      o.PAYMENT_STATUS,
      o.ORDER_STATUS,
      o.ADDRESS_LINE1,
      o.CITY,
      o.STATE,
      o.POSTAL_CODE,
      o.CONTACT_PHONE,
      o.ORDERED_AT
    ORDER BY o.ORDERED_AT DESC`,
    { userId }
  );

  return normalizeRows(result);
}

export async function getOrderById(orderId, userId) {
  const result = await executeQuery(
    `SELECT
      o.ORDER_ID,
      o.CUSTOMER_ID,
      o.TOTAL_AMOUNT,
      o.DISCOUNT_AMOUNT,
      o.DELIVERY_CHARGE,
      o.FINAL_AMOUNT,
      o.PAYMENT_STATUS,
      o.ORDER_STATUS,
      o.ADDRESS_LINE1,
      o.CITY,
      o.STATE,
      o.POSTAL_CODE,
      o.CONTACT_PHONE,
      o.ORDERED_AT,
      oi.PROD_ID,
      oi.QUANTITY,
      oi.UNIT_PRICE,
      p.PROD_NAME,
      p.IMAGE_URL,
      v.SHOP_NAME
    FROM ORDERS o
    JOIN ORDER_ITEMS oi ON o.ORDER_ID = oi.ORDER_ID
    LEFT JOIN PRODUCTS p ON oi.PROD_ID = p.PROD_ID
    LEFT JOIN VENDORS v ON p.VENDOR_ID = v.VENDOR_ID
    WHERE o.ORDER_ID = :orderId AND o.CUSTOMER_ID = :userId
    ORDER BY oi.ITEM_ID`,
    { orderId, userId }
  );

  const rows = normalizeRows(result);
  if (!rows.length) {
    return null;
  }

  const first = rows[0];
  return {
    order_id: first.ORDER_ID,
    user_id: first.CUSTOMER_ID,
    total_amount: first.TOTAL_AMOUNT,
    discount_amount: first.DISCOUNT_AMOUNT,
    delivery_charge: first.DELIVERY_CHARGE,
    final_amount: first.FINAL_AMOUNT,
    payment_status: first.PAYMENT_STATUS,
    status: first.ORDER_STATUS,
    created_at: first.ORDERED_AT,
    address: {
      line1: first.ADDRESS_LINE1,
      city: first.CITY,
      state: first.STATE,
      postal_code: first.POSTAL_CODE,
      phone: first.CONTACT_PHONE,
    },
    items: rows.map((row) => ({
      prod_id: row.PROD_ID,
      quantity: row.QUANTITY,
      unit_price: row.UNIT_PRICE,
      prod_name: row.PROD_NAME,
      image_url: row.IMAGE_URL,
      shop_name: row.SHOP_NAME,
    })),
  };
}
