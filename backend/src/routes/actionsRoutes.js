import express from 'express';
import { getSwipe, sendSwipe } from '../controllers/actionsController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validateFieldCount, validateRequiredFields } from 'psgutil';

const router = express.Router();

router.get('/swipe', authMiddleware, validateFieldCount(1), validateRequiredFields(['distanceLimitKm']), getSwipe);
router.post('/swipe', authMiddleware, validateFieldCount(2), validateRequiredFields(['receiverId', 'type']), sendSwipe);

export default router;