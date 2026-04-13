import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'secret123';

export const protect = async (req, res, next) => {
  let token;
  
  try {
    token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
      email: decoded.email,
      vendor_id: decoded.vendor_id || null
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalProtect = async (req, _res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret);
    req.user = {
      user_id: decoded.user_id,
      role: decoded.role,
      email: decoded.email,
      vendor_id: decoded.vendor_id || null
    };

    next();
  } catch (_error) {
    req.user = null;
    next();
  }
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

