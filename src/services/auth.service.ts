import { injectable, inject } from 'tsyringe';
import { TOKENS, IUserRepository } from '../types/auth.type';
import { LoginDtoType, RegisterDtoType } from '../dtos/auth.dto';
import { AppError } from '../middlewares/error-handler.middleware';
import logger from '../utils/logger.util';
import { Request } from 'express';
import { TokenUtil } from '../utils/token.util';

@injectable()
export class AuthService {
  constructor(
    @inject(TOKENS.UserRepository) private readonly userRepo: IUserRepository
  ) {}

  async register(req: Request, dto: RegisterDtoType) {
    const { email, password } = dto;
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) throw new AppError(400, 'Email already exists');

    const user = await this.userRepo.create({ email, password });
    const { userId } = user;

    logger.info('User registered', {
      requestId: req.context?.requestId,
      email,
      userId,
    });
    return { userId, email };
  }

  async login(req: Request, dto: LoginDtoType) {
    const { email, password } = dto;
    const user = await this.userRepo.findByEmailForLogin(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = TokenUtil.generateToken(user.userId, user.email);

    logger.info('User logged in', {
      requestId: req.context?.requestId,
      email,
      userId: user.userId,
    });
    return { token, userId: user.userId, email };
  }
}
