import { Router } from 'express';
import {
  getSmartRoute,
  getPlaces,
  getTransportComparison,
} from '../controllers/travelController';

const router = Router();

// Travel discovery endpoints are open to all visitors/authenticated users
router.get('/route', getSmartRoute);
router.get('/places', getPlaces);
router.get('/transport', getTransportComparison);

export default router;
