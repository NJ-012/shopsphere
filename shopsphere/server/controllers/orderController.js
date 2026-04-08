import { isDbAvailable } from '../db/db.js';
import {
  createOrder as mysqlCreateOrder,
  getOrderById as mysqlGetOrderById,
  getUserOrders as mysqlGetUserOrders,
} from '../db/queries.js';
import { sendOrderConfirmation } from '../utils/emailService.js';
import { buildMockProductImage } from '../utils/mockImage.js';

function calculateTotals(items) {
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const discountAmount = totalAmount >= 2500 ? Math.round(totalAmount * 0.1) : 0;
  const deliveryCharge = totalAmount - discountAmount >= 999 ? 0 : 49;

  return {
    totalAmount,
    discountAmount,
    deliveryCharge,
    finalAmount: totalAmount - discountAmount + deliveryCharge,
  };
}

function normalizeOracleOrder(order) {
  const normalizedItems = (order.items ?? []).map((item) => ({
    ...item,
    image_url: item.IMAGE_URL || item.image_url || buildMockProductImage(item),
  }));

  return {
    order_id: order.order_id ?? order.ORDER_ID,
    user_id: order.user_id ?? order.CUSTOMER_ID,
    total_amount: Number(order.total_amount ?? order.TOTAL_AMOUNT ?? 0),
    discount_amount: Number(order.discount_amount ?? order.DISCOUNT_AMOUNT ?? 0),
    delivery_charge: Number(order.delivery_charge ?? order.DELIVERY_CHARGE ?? 0),
    final_amount: Number(order.final_amount ?? order.FINAL_AMOUNT ?? 0),
    payment_status: order.payment_status ?? order.PAYMENT_STATUS ?? 'PENDING',
    status: order.status ?? order.ORDER_STATUS ?? 'PENDING',
    created_at: order.created_at ?? order.ORDERED_AT,
    item_count: Number(order.item_count ?? order.ITEM_COUNT ?? order.items?.length ?? 0),
    address: order.address ?? {
      line1: order.ADDRESS_LINE1,
      city: order.CITY,
      state: order.STATE,
      postal_code: order.POSTAL_CODE,
      phone: order.CONTACT_PHONE,
    },
    items: normalizedItems,
  };
}

export const createOrder = async (req, res) => {
  try {
    const { address, items } = req.body;

    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Address and at least one order item are required.' });
    }

    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const normalizedItems = items.map((item) => ({
      prod_id: Number(item.prod_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price || item.price || 0),
      prod_name: item.prod_name || '',
      image_url: item.image_url || buildMockProductImage(item),
      shop_name: item.shop_name || '',
    }));

    const totals = calculateTotals(normalizedItems);
    const orderResult = await mysqlCreateOrder(req.user.user_id, normalizedItems, address, totals);

    const createdOrder = {
      order_id: orderResult.order_id,
      user_id: req.user.user_id,
      address,
      items: normalizedItems,
      total_amount: totals.totalAmount,
      discount_amount: totals.discountAmount,
      delivery_charge: totals.deliveryCharge,
      final_amount: totals.finalAmount,
      payment_status: 'PENDING',
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    // Ignore email errors gracefully
    try {
      if (sendOrderConfirmation) {
        await sendOrderConfirmation(req.user.email, {
          order_id: createdOrder.order_id,
          items: createdOrder.items.map((item) => ({
            name: item.prod_name,
            quantity: item.quantity,
            price: item.unit_price,
          })),
          total: createdOrder.final_amount,
          address: [address.line1, address.city, address.state, address.postal_code].filter(Boolean).join(', '),
        });
      }
    } catch {}

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to create order.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const orders = await mysqlGetUserOrders(req.user.user_id);
    return res.json(orders.map(normalizeOracleOrder));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch your orders.' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    if (!isDbAvailable()) {
       return res.status(500).json({ error: 'Database not available' });
    }

    const order = await mysqlGetOrderById(orderId, req.user.user_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.json(normalizeOracleOrder(order));
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
};

export const cancelOrder = async (req, res) => {
  res.status(501).json({ error: 'Order cancellation is not implemented yet in MySQL schema.' });
};
