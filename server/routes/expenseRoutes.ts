import { Router } from 'express';
import {
  updateExpense,
  deleteExpense,
  getUserFinancialOverview,
} from '../controllers/expenseController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/overview', getUserFinancialOverview);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
