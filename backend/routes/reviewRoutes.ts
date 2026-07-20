import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:placeId', getReviews);
router.post('/', authenticateToken, createReview);

export default router;
