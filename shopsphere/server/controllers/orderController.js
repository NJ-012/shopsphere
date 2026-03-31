import { getConnection } from '../db/db.js';
import { sendOrderConfirmation } from '../utils/emailService.js';
import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

export const createOrder = async (req, res) => {
  let conn;
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { address_id, items, coupon_code } = req.body;

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    // Validate coupon
    let discount = 0;
    let couponId = null;
    if (coupon_code) {
      const couponResult = await executeQuery(
        `SELECT coupon_id, coupon_type, value, max_discount, min_order_amt, usage_limit, used_count, valid_until 
         FROM COUPONS WHERE UPPER(code) = UPPER(:code) AND is_active = 1 
         AND valid_until > SYSTIMESTAMP AND used_count < usage_limit`,
        [coupon_code]
      );
      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];
        if (totalAmount >= coupon.min_order_amt) {
          if (coupon.coupon_type === 'PERCENT') {
            discount = Math.min(totalAmount * coupon.value / 100, coupon.max_discount);
          } else {
            discount = Math.min(coupon.value, totalAmount);
          }
          couponId = coupon.coupon_id;
        }
      }
    }

    const deliveryCharge = (totalAmount - discount) >= 999 ? 0 : 49;
    const finalAmount = totalAmount - discount + deliveryCharge;

    conn = await getConnection();

    await conn.execute('BEGIN TRANSACTION');
    
    // 1. Insert order
    const orderResult = await conn.execute(
      `INSERT INTO ORDERS (user_id, address_id, total_amount, discount_amount, delivery_charge, final_amount, coupon_id, status)
       VALUES (:user_id, :address_id, :total_amount, :discount_amount, :delivery_charge, :final_amount, :coupon_id, 'PENDING')
       RETURNING order_id INTO :oid`,
      {
        user_id: req.user.user_id,
        address_id,
        total_amount: totalAmount,
        discount_amount: discount,
        delivery_charge: deliveryCharge,
        final_amount: finalAmount,
        coupon_id: couponId,
        oid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const orderId = orderResult.outBinds.oid;

    // 2. Insert order items (trigger handles stock check)
    for (const item of items) {
      await conn.execute(
        `INSERT INTO ORDER_ITEMS (order_id, prod_id, quantity, unit_price, variant_id)
         VALUES (:order_id, :prod_id, :quantity, :unit_price, :variant_id)`,
        { order_id: orderId, prod_id: item.prod_id, quantity: item.quantity, unit_price: item.unit_price, variant_id: item.variant_id || null }
      );
    }

    // 3. Update product stock (redundant with trigger, but explicit)
    for (const item of items) {
      await conn.execute(
        'UPDATE PRODUCTS SET stock_qty = stock_qty - :qty WHERE prod_id = :prod_id',
        { qty: item.quantity, prod_id: item.prod_id }
      );
    }

    // 4. Update coupon usage
    if (couponId) {
      await conn.execute(
        'UPDATE COUPONS SET used_count = used_count + 1 WHERE coupon_id = :coupon_id',
        { coupon_id: couponId }
      );
    }

    // 5. Add notification
    await conn.execute(
      `INSERT INTO NOTIFICATIONS (user_id, title, message, type, is_read)
       VALUES (:user_id, 'Order Created', 'Your order #\${orderId} has been created successfully!', 'ORDER', 0)`,
      { user_id: req.user.user_id }
    );

    await conn.commit();

    // Fire and forget email
    const userResult = await executeQuery(
      'SELECT email, full_name FROM USERS WHERE user_id = :uid',
      [req.user.user_id]
    );
    if (userResult.rows.length > 0) {
      sendOrderConfirmation(userResult.rows[0].email, {
        order_id: orderId,
        items: items.map(item => ({ name: 'Product', quantity: item.quantity, price: item.unit_price })),
        total: finalAmount,
        address: 'TBD'
      }).catch(console.error);
    }

    res.json({ order_id: orderId, final_amount: finalAmount });
  } catch (error) {
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
      }
    }
    console.error('Create order error:', error);
    res.status(400).json({ error: error.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error('Connection close error:', closeErr);
      }
    }
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await executeQuery(
      `SELECT o.order_id, o.status, o.payment_status, o.final_amount, o.created_at,
        COUNT(oi.item_id) as item_count
       FROM ORDERS o
       LEFT JOIN ORDER_ITEMS oi ON o.order_id = oi.order_id
       WHERE o.user_id = :user_id
       GROUP BY o.order_id, o.status, o.payment_status, o.final_amount, o.created_at
       ORDER BY o.created_at DESC`,
      [req.user.user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    const result = await executeQuery(
      `SELECT o.*, a.*, oi.*, p.prod_name, pi.image_url
       FROM ORDERS o
       JOIN ADDRESSES a ON o.address_id = a.address_id
       JOIN ORDER_ITEMS oi ON o.order_id = oi.order_id
       JOIN PRODUCTS p ON oi.prod_id = p.prod_id
       LEFT JOIN PRODUCT_IMAGES pi ON p.prod_id = pi.prod_id AND pi.is_primary = 1
       WHERE o.order_id = :id AND o.user_id = :user_id`,
      [id, req.user.user_id]
    );

    // Group by order if multiple items
    res.json(result.rows);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const cancelOrder = async (req, res) => {
  let conn;
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    
    const orderResult = await executeQuery(
      'SELECT status, payment_status FROM ORDERS WHERE order_id = :id AND user_id = :user_id',
      [id, req.user.user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }

    conn = await getConnection();
    await conn.execute('BEGIN TRANSACTION');

    // Update order
    await conn.execute(
      'UPDATE ORDERS SET status = \'CANCELLED\' WHERE order_id = :id',
      [id]
    );

    // Refund payment status if paid
    if (order.payment_status === 'PAID') {
      await conn.execute(
        'UPDATE ORDERS SET payment_status = \'REFUNDED\' WHERE order_id = :id',
        [id]
      );
    }

    // Restore stock
    const items = await conn.execute(
      'SELECT prod_id, quantity FROM ORDER_ITEMS WHERE order_id = :id',
      [id]
    );
    for (const item of items.rows) {
      await conn.execute(
        'UPDATE PRODUCTS SET stock_qty = stock_qty + :qty WHERE prod_id = :prod_id',
        [item.quantity, item.prod_id]
      );
    }

    // Notification
    await conn.execute(
      `INSERT INTO NOTIFICATIONS (user_id, title, message, type)
       VALUES (:user_id, 'Order Cancelled', 'Your order #\${id} has been cancelled.', 'ORDER')`,
      [req.user.user_id]
    );

    await conn.commit();
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    if (conn) await conn.rollback().catch(console.error);
    console.error('Cancel order error:', error);
    res.status(400).json({ error: error.message });
  } finally {
    if (conn) await conn.close().catch(console.error);
  }
};

