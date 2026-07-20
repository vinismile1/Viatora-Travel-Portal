import { Router } from 'express';
import { getConversations, createConversation, chat, generateItinerary } from '../controllers/aiController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.post('/chat', chat);
router.post('/generate-itinerary', generateItinerary);

export default router;
