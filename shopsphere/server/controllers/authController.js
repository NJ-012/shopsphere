import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isDbAvailable } from '../db/db.js';
import { createUser, createVendor, getUserByEmail, getUserById } from '../db/queries.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

dotenv.config();

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    user_id: user.USER_ID,
    full_name: user.FULL_NAME,
    email: user.EMAIL,
    role: user.ROLE,
    phone: user.PHONE || '',
    shop_name: user.SHOP_NAME || '',
    is_verified: user.IS_VERIFIED ? true : false,
    created_at: user.CREATED_AT,
    is_active: true,
  };
}

function sanitizeUser(user, password_hash) {
  const normalized = normalizeUser(user);
  if (!normalized) return null;
  return normalized;
}

function signUserToken(user) {
  return jwt.sign(
    {
      user_id: user.USER_ID,
      role: user.ROLE,
      email: user.EMAIL,
    },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '7d' }
  );
}

export const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role = 'CUSTOMER',
      phone,
      shop_name,
    } = req.body;

    if (!full_name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Full name, email, password and phone are required.' });
    }

    if (!['CUSTOMER', 'VENDOR', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Only CUSTOMER/VENDOR registrations are allowed.' });
    }

    if (role === 'VENDOR' && !shop_name) {
      return res.status(400).json({ error: 'Shop name is required for vendor registration.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser(
      String(full_name).trim(),
      normalizedEmail,
      passwordHash,
      role,
      String(phone).trim()
    );

    if (role === 'VENDOR') {
      await createVendor(userId, String(shop_name).trim(), 0);
    }

    const createdUser = await getUserById(userId);

    // Suppress email errors if email service isn't setup
    try {
      if (sendWelcomeEmail) await sendWelcomeEmail(normalizedEmail, String(full_name).trim());
    } catch {}

    res.status(201).json({
      message: 'Registered successfully.',
      user: sanitizeUser(createdUser, passwordHash),
      dbConnected: isDbAvailable(),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Unable to register user.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);

    if (!user || !user.PASSWORD_HASH) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signUserToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: sanitizeUser(user),
      token,
      dbConnected: isDbAvailable(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Unable to login right now.' });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully.' });
};

export const getMe = async (req, res) => {
  try {
    if (!req.user?.user_id) {
      return res.json({
        user: null,
        dbConnected: isDbAvailable(),
      });
    }

    const user = await getUserById(req.user.user_id);

    if (!user) {
      res.clearCookie('token');
      return res.json({
        user: null,
        dbConnected: isDbAvailable(),
      });
    }

    res.json({
      user: sanitizeUser(user),
      dbConnected: isDbAvailable(),
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Unable to fetch current user.' });
  }
};
