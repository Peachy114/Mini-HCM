import express from 'express';
import { register, getProfile, login } from '../controllers/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

//auth
router.post('/register', verifyToken, register);
router.post('/login', verifyToken, login)
router.get('/me', verifyToken, getProfile);

export default router;