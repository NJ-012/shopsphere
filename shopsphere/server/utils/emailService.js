import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },
});

export async function sendOrderConfirmation(to, orderDetails) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Order Confirmed! #${orderDetails.order_id}</h2>
        <div>
          <h3>Order Details:</h3>
          <ul>
            ${orderDetails.items.map(item => `<li>${item.name} x${item.quantity} - $${item.price}</li>`).join('')}
          </ul>
          <p><strong>Total: $${orderDetails.total}</strong></p>
          <p><strong>Delivery Address:</strong> ${orderDetails.address}</p>
        </div>
        <a href="${orderDetails.trackUrl || '#'}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track your order</a>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: `Order Confirmed! #${orderDetails.order_id}`,
      html,
    });
  } catch (error) {
    console.error('Order confirmation email failed:', error);
  }
}

export async function sendWelcomeEmail(to, fullName) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to ShopSphere, ${fullName}!</h2>
        <p>We're excited to have you on board. Start shopping now and discover amazing products!</p>
        <p>Happy Shopping!<br>The ShopSphere Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: 'Welcome to ShopSphere!',
      html,
    });
  } catch (error) {
    console.error('Welcome email failed:', error);
  }
}

export async function sendVendorApprovalEmail(to, shopName) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Your ShopSphere Store is Approved!</h2>
        <p>Congratulations ${shopName}! Your vendor account has been approved.</p>
        <p>You can now start listing products and receiving orders.</p>
        <p>Happy Selling!<br>The ShopSphere Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: 'Your ShopSphere Store is Approved!',
      html,
    });
  } catch (error) {
    console.error('Vendor approval email failed:', error);
  }
}

