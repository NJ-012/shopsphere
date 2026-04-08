import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initPool, isDbAvailable, getDbInitError } from './db/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: clientOrigin,
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    dbConnected: isDbAvailable(),
    mode: isDbAvailable() ? 'mysql' : 'unavailable',
    dbError: getDbInitError() ? getDbInitError().message : null,
    clientOrigin
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

async function start() {
  try {
    await initPool();
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Mode: MySQL database`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
