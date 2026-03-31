import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { executeQuery } from '../db/db.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  try {
    const { full_name, email, password, role, phone, shop_name } = req.body;

    // Validation
    if (!full_name || !email || !password || !role || !phone) {
      return res.status(400).json({ error: 'All fields required' });
    }
    if (!['CUSTOMER', 'VENDOR'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Check existing email
    const countResult = await executeQuery('SELECT COUNT(*) as count FROM USERS WHERE email = :email', [email]);
    if (countResult.rows[0].count > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with RETURNING
    const userResult = await executeQuery(
      `INSERT INTO USERS (full_name, email, password_hash, role, phone) 
       VALUES (:full_name, :email, :password_hash, :role, :phone) 
       RETURNING user_id INTO :uid`,
      {
        full_name, 
        email, 
        password_hash: hashedPassword, 
        role, 
        phone,
        uid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    const userId = userResult.outBinds.uid;

    // Insert vendor if VENDOR
    if (role === 'VENDOR' && shop_name) {
      await executeQuery(
        'INSERT INTO VENDORS (user_id, shop_name) VALUES (:user_id, :shop_name)',
        { user_id: userId, shop_name }
      );
    }

    // Send welcome email fire and forget
    sendWelcomeEmail(email, full_name).catch(console.error);

    res.status(201).json({ message: 'Registered successfully', user_id: userId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await executeQuery(
      `SELECT user_id, full_name, email, password_hash, role, is_active, avatar_url 
       FROM USERS WHERE email = :email`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    const { password_hash, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT u.user_id, u.full_name, u.email, u.role, u.phone, u.avatar_url,
        v.vendor_id, v.shop_name, v.is_verified
       FROM USERS u 
       LEFT JOIN VENDORS v ON v.user_id = u.user_id
       WHERE u.user_id = :uid`,
      [req.user.user_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

