import { Router } from 'express';
import { updateActivity, deleteActivity } from '../controllers/activityController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
