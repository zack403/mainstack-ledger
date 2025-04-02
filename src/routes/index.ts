import { Router } from 'express';
import authRoute from './auth.routes';
import accountRoute from './account.routes';
import { authenticate } from '../middlewares/auth.middleware';
import transactionRoutes from './transaction.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/account', authenticate, accountRoute);
router.use('/transactions', transactionRoutes);

export default router;
