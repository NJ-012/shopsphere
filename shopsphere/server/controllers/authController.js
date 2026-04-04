import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getStore, mutateStore, nextId } from '../data/store.js';
import { isOracleAvailable } from '../db/db.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

dotenv.config();

function signUserToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export const register = async (req, res) => {
  try {
    const { full_name, email, password, role = 'CUSTOMER', phone, shop_name } = req.body;

    if (!full_name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Full name, email, password and phone are required.' });
    }

    if (!['CUSTOMER', 'VENDOR'].includes(role)) {
      return res.status(400).json({ error: 'Only CUSTOMER and VENDOR registrations are allowed.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    let createdUser;

    await mutateStore(async (store) => {
      const existing = store.users.find((user) => user.email.toLowerCase() === normalizedEmail);
      if (existing) {
        const error = new Error('Email already registered.');
        error.status = 409;
        throw error;
      }

      createdUser = {
        user_id: nextId(store.users, 'user_id'),
        full_name: String(full_name).trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role,
        phone: String(phone).trim(),
        avatar_url: '',
        is_active: true,
        shop_name: role === 'VENDOR' ? String(shop_name || '').trim() : '',
        is_verified: role === 'VENDOR' ? false : undefined,
        created_at: new Date().toISOString()
      };

      store.users.push(createdUser);
      return store;
    });

    sendWelcomeEmail(createdUser.email, createdUser.full_name).catch(console.error);

    res.status(201).json({
      message: 'Registered successfully.',
      user: sanitizeUser(createdUser),
      oracleConnected: isOracleAvailable()
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

    const store = await getStore();
    const user = store.users.find((item) => item.email.toLowerCase() === String(email).trim().toLowerCase());

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signUserToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: sanitizeUser(user),
      oracleConnected: isOracleAvailable()
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
    const store = await getStore();
    const user = store.users.find((item) => item.user_id === req.user.user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: sanitizeUser(user),
      oracleConnected: isOracleAvailable()
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Unable to fetch current user.' });
  }
};
