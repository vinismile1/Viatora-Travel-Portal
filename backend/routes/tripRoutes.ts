import { Router } from 'express';
import {
  getTrips,
  createTrip,
  deleteTrip,
  getTripItems,
  createTripItem,
  deleteTripItem,
  toggleTripItem
} from '../controllers/tripController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', createTrip);
router.delete('/:id', deleteTrip);
router.get('/:id/items', getTripItems);
router.post('/:id/items', createTripItem);
router.delete('/items/:itemId', deleteTripItem);
router.patch('/items/:itemId/toggle', toggleTripItem);

export default router;
