import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { optionalProtect, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', optionalProtect, getMe);

export default router;

