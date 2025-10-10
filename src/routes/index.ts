import { Router } from 'express';
import authRoute from './auth.routes';
import accountRoute from './account.route';
import { authenticate } from '../middlewares/auth.middleware';
import transactionRoutes from './transaction.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/account', authenticate, accountRoute);
router.use('/transactions', authenticate, transactionRoutes);

export default router;
