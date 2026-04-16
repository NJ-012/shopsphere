import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initPool, isDbAvailable, getDbInitError } from './db/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
  clientOrigin,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://10.168.32.251:5173',
  'http://10.168.34.221:5173',
  'http://10.166.84.58:5173',
  'http://172.28.111.58:5173',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];
const normalizedAllowedOrigins = allowedOrigins.map((origin) => String(origin).trim().replace(/\/$/, '').toLowerCase());
const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = origin ? String(origin).trim().replace(/\/$/, '').toLowerCase() : '';
    if (!origin || normalizedAllowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(cookieParser());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/status', (_req, res) => {
  res.json({
    success: true,
    data: {
      dbConnected: isDbAvailable(),
      mode: isDbAvailable() ? 'sqlite' : 'unavailable',
      dbError: getDbInitError() ? getDbInitError().message : null,
      clientOrigin
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, _next) => {
  console.error(err);
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

async function start() {
  try {
    await initPool();
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Mode: SQLite database`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
