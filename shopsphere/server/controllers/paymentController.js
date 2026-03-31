import crypto from 'crypto';
import { executeQuery } from '../db/db.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, order_id } = req.body;

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `order_${order_id}`
    };

    // Mock Razorpay response (replace with real Razorpay when keys added)
    const rzpOrder = {
      id: `mock_order_${Date.now()}`,
      amount: amount * 100,
      currency: 'INR',
      status: 'created'
    };

    await executeQuery(
      'UPDATE ORDERS SET razorpay_order_id = :rzp_id WHERE order_id = :order_id',
      { rzp_id: rzpOrder.id, order_id }
    );

    res.json({
      razorpay_order_id: rzpOrder.id,
      amount: amount * 100,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID || 'mock_key'
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Payment setup failed' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, order_id } = req.body;

    // Mock verification (replace with real Razorpay + crypto signature check)
    await executeQuery(
      `UPDATE ORDERS SET 
         payment_status = 'PAID', 
         status = 'CONFIRMED',
         payment_method = 'RAZORPAY', 
         razorpay_payment_id = :payment_id
       WHERE order_id = :order_id`,
      { payment_id: razorpay_payment_id, order_id }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

