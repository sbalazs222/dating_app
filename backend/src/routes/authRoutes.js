import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateFieldCount, validateRequiredFields } from 'psgutil';

const router = express.Router();

router.post('/login',validateFieldCount(2), validateRequiredFields(['email', 'password']), login);
router.post('/register',validateFieldCount(9), validateRequiredFields(['username', 'password', 'email', 'fullname', 'birthdate', 'gender', 'bio', 'latitude', 'longitude']), register);
router.post('/logout', authMiddleware, logout);

export default router;