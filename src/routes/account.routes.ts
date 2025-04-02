import { Router } from 'express';
import container from '../container';
import { TOKENS } from '../types/app.types';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { AccountController } from '../controllers/account.controller';
import { validate } from '../middlewares/validate.middleware';
import { UpdateAccountDto } from '../dtos/account.dto';

const router = Router();
const accountController = container.resolve<AccountController>(
  TOKENS.AccountController
);

router.get(
  '/',
  authenticate,
  asyncHandler(accountController.getAccounts.bind(accountController))
);

router.get(
  '/:accountId',
  authenticate,
  asyncHandler(accountController.getAccount.bind(accountController))
);

router.patch(
  '/:accountId',
  authenticate,
  validate(UpdateAccountDto),
  asyncHandler(accountController.updateAccount.bind(accountController))
);

export default router;
