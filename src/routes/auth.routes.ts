import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import container from '../container';
import { TOKENS } from '../types/app.types';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { asyncHandler } from '../middlewares/async-handler.middleware';

const router = Router();
const authController = container.resolve<AuthController>(TOKENS.AuthController);

router.post(
  '/register',
  validate(RegisterDto),
  asyncHandler(authController.register.bind(authController))
);

router.post(
  '/login',
  validate(LoginDto),
  asyncHandler(authController.login.bind(authController))
);

export default router;
