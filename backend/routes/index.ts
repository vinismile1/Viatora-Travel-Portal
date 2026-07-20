import { Router } from 'express';
import authRouter from './authRoutes.js';
import tripRouter from './tripRoutes.js';
import bookingRouter from './bookingRoutes.js';
import aiRouter from './aiRoutes.js';
import reviewRouter from './reviewRoutes.js';
import notificationRouter from './notificationRoutes.js';
import expenseRouter from './expenseRoutes.js';

// Import specific handlers for general items not mapped in a dedicated sub-router
import { getPreferences, updatePreferences } from '../controllers/authController.js';
import { getSavedPlaces, savePlace, getDestinations, getDestinationById, getHotels, getRestaurants, getAttractions } from '../controllers/tripController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Mount sub-routers
router.use('/auth', authRouter);
router.use('/trips', tripRouter);
router.use('/bookings', bookingRouter);
router.use('/ai', aiRouter);
router.use('/reviews', reviewRouter);
router.use('/notifications', notificationRouter);
router.use('/expenses', expenseRouter);

// Preferences routes
const usersRouter = Router();
usersRouter.get('/preferences', authenticateToken, getPreferences);
usersRouter.post('/preferences', authenticateToken, updatePreferences);
router.use('/users', usersRouter);

// Saved places routes
const savedRouter = Router();
savedRouter.get('/', authenticateToken, getSavedPlaces);
savedRouter.post('/', authenticateToken, savePlace);
router.use('/saved', savedRouter);

// Discovery endpoints
router.get('/destinations', getDestinations);
router.get('/destinations/:id', getDestinationById);
router.get('/hotels', getHotels);
router.get('/restaurants', getRestaurants);
router.get('/attractions', getAttractions);

export default router;
