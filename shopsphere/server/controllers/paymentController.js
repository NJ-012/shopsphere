import { mutateStore } from '../data/store.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, order_id } = req.body;

    if (!amount || !order_id) {
      return res.status(400).json({ error: 'Amount and order_id are required.' });
    }

    const razorpayOrderId = `mock_order_${Date.now()}`;

    await mutateStore(async (store) => {
      const order = store.orders.find((item) => item.order_id === Number(order_id) && item.user_id === req.user.user_id);
      if (!order) {
        const error = new Error('Order not found.');
        error.status = 404;
        throw error;
      }
      order.razorpay_order_id = razorpayOrderId;
      return store;
    });

    res.json({
      razorpay_order_id: razorpayOrderId,
      amount: Number(amount) * 100,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID || 'mock_key'
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Unable to initialize payment.' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, order_id } = req.body;

    if (!razorpay_payment_id || !order_id) {
      return res.status(400).json({ error: 'Payment id and order id are required.' });
    }

    await mutateStore(async (store) => {
      const order = store.orders.find((item) => item.order_id === Number(order_id) && item.user_id === req.user.user_id);
      if (!order) {
        const error = new Error('Order not found.');
        error.status = 404;
        throw error;
      }
      order.payment_status = 'PAID';
      order.status = 'CONFIRMED';
      order.razorpay_payment_id = razorpay_payment_id;
      order.payment_method = 'Razorpay';
      return store;
    });

    res.json({ success: true, message: 'Payment verified successfully.' });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Unable to verify payment.' });
  }
};
