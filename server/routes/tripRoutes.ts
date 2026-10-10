import { Router } from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController';
import { getActivitiesByTrip, createActivity } from '../controllers/activityController';
import { getExpensesByTrip, createExpense } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getTrips);
router.post('/', createTrip);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

// Nested activity routes for trips
router.get('/:tripId/activities', getActivitiesByTrip);
router.post('/:tripId/activities', createActivity);

// Nested expense routes for trips
router.get('/:tripId/expenses', getExpensesByTrip);
router.post('/:tripId/expenses', createExpense);

export default router;
