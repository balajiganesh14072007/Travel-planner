import { Router } from 'express';
import { getAdminOverview, getAdminUsers, getAdminTrips } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAdminUsers);
router.get('/trips', getAdminTrips);

export default router;
