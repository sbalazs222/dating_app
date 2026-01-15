import express from 'express';
import { getSwipe } from '../controllers/actionsController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateFieldCount, validateRequiredFields } from 'psgutil';

const router = express.Router();

router.get('/swipe', authMiddleware, validateFieldCount(1), validateRequiredFields(['distanceLimitKm']), getSwipe);

export default router;