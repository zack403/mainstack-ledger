import { Router } from 'express';
import container from '../container';
import { TOKENS } from '../types/app.types';
import { TransactionController } from '../controllers/transaction.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  DepositDto,
  TransferDto,
  WithdrawalDto,
} from '../dtos/transaction.dto';
import rateLimit from 'express-rate-limit';

const depositRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Too many deposit requests from this IP, please try again later.',
});

const withdrawalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: 'Too many withdrawal requests from this IP, please try again later.',
});

const transferRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: 'Too many transfer requests from this IP, please try again later.',
});

const router = Router();
const transactionController = container.resolve<TransactionController>(
  TOKENS.TransactionController
);

router.post(
  '/deposit',
  depositRateLimiter,
  authenticate,
  validate(DepositDto),
  asyncHandler(transactionController.deposit.bind(transactionController))
);
router.post(
  '/withdraw',
  withdrawalRateLimiter,
  authenticate,
  validate(WithdrawalDto),
  asyncHandler(transactionController.withdraw.bind(transactionController))
);
router.post(
  '/transfer',
  transferRateLimiter,
  authenticate,
  validate(TransferDto),
  asyncHandler(transactionController.transfer.bind(transactionController))
);
router.get(
  '/',
  authenticate,
  asyncHandler(
    transactionController.listUserTransactions.bind(transactionController)
  )
);
router.get(
  '/:transactionId',
  authenticate,
  asyncHandler(transactionController.getTransaction.bind(transactionController))
);
router.get(
  '/:transactionId/ledger-entries',
  authenticate,
  asyncHandler(
    transactionController.getTransactionsLedger.bind(transactionController)
  )
);
export default router;
