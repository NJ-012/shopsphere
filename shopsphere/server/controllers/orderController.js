import { getStore, mutateStore, nextId } from '../data/store.js';
import { sendOrderConfirmation } from '../utils/emailService.js';

function calculateTotals(items) {
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const discountAmount = totalAmount >= 2500 ? Math.round(totalAmount * 0.1) : 0;
  const deliveryCharge = totalAmount - discountAmount >= 999 ? 0 : 49;
  return {
    totalAmount,
    discountAmount,
    deliveryCharge,
    finalAmount: totalAmount - discountAmount + deliveryCharge
  };
}

export const createOrder = async (req, res) => {
  try {
    const { address, items } = req.body;

    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Address and at least one order item are required.' });
    }

    let createdOrder;

    await mutateStore(async (store) => {
      const normalizedItems = items.map((item) => {
        const product = store.products.find((entry) => entry.prod_id === Number(item.prod_id));
        if (!product) {
          const error = new Error('One of the selected products no longer exists.');
          error.status = 404;
          throw error;
        }
        if (product.stock_qty < Number(item.quantity)) {
          const error = new Error(product.prod_name + ' is out of stock for the requested quantity.');
          error.status = 400;
          throw error;
        }
        return {
          prod_id: product.prod_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price || Math.round(product.price * (1 - (product.discount_pct || 0) / 100))),
          prod_name: product.prod_name,
          image_url: product.image_url
        };
      });

      const totals = calculateTotals(normalizedItems);
      createdOrder = {
        order_id: nextId(store.orders, 'order_id'),
        user_id: req.user.user_id,
        address,
        items: normalizedItems,
        total_amount: totals.totalAmount,
        discount_amount: totals.discountAmount,
        delivery_charge: totals.deliveryCharge,
        final_amount: totals.finalAmount,
        payment_status: 'PENDING',
        payment_method: 'Razorpay',
        status: 'PENDING',
        created_at: new Date().toISOString()
      };

      normalizedItems.forEach((item) => {
        const product = store.products.find((entry) => entry.prod_id === item.prod_id);
        product.stock_qty -= item.quantity;
      });

      store.orders.unshift(createdOrder);
      return store;
    });

    const store = await getStore();
    const user = store.users.find((item) => item.user_id === req.user.user_id);
    if (user) {
      sendOrderConfirmation(user.email, {
        order_id: createdOrder.order_id,
        items: createdOrder.items.map((item) => ({ name: item.prod_name, quantity: item.quantity, price: item.unit_price })),
        total: createdOrder.final_amount,
        address: [address.line1, address.city, address.state, address.postal_code].filter(Boolean).join(', ')
      }).catch(console.error);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to create order.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const store = await getStore();
    const orders = store.orders.filter((item) => item.user_id === req.user.user_id);
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch your orders.' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const store = await getStore();
    const order = store.orders.find((item) => item.order_id === orderId && item.user_id === req.user.user_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    let cancelledOrder;

    await mutateStore(async (store) => {
      const order = store.orders.find((item) => item.order_id === orderId && item.user_id === req.user.user_id);
      if (!order) {
        const error = new Error('Order not found.');
        error.status = 404;
        throw error;
      }
      if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
        const error = new Error('This order can no longer be cancelled.');
        error.status = 400;
        throw error;
      }

      order.status = 'CANCELLED';
      if (order.payment_status === 'PAID') {
        order.payment_status = 'REFUNDED';
      }

      order.items.forEach((item) => {
        const product = store.products.find((entry) => entry.prod_id === item.prod_id);
        if (product) {
          product.stock_qty += item.quantity;
        }
      });

      cancelledOrder = order;
      return store;
    });

    res.json(cancelledOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to cancel order.' });
  }
};
