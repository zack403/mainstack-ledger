import { LoginDtoType, RegisterDtoType } from '../dtos/auth.dto';
import { IUser } from '../models/user.model';
import { Request } from 'express';

export interface IUserRepository {
  create(user: { email: string; password: string }): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findByEmailForLogin(email: string): Promise<IUser>;
}

export interface IAuthService {
  register(
    req: Request,
    dto: RegisterDtoType
  ): Promise<{
    userId: string;
    email: string;
    accountId: string;
    accountNumber: string;
  }>;
  login(
    req: Request,
    dto: LoginDtoType
  ): Promise<{ token: string; userId: string }>;
}
