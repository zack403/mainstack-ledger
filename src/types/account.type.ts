import { UpdateAccountDtoType } from '../dtos/account.dto';
import { IAccount } from '../models/account.model';
import { Request } from 'express';

export interface IAccountRepository {
  create(account: { userId: string; accountNumber: string }): Promise<IAccount>;
  findById(accountId: string, userId: string): Promise<IAccount | null>;
  findByUserId(userId: string): Promise<IAccount[]>;
  update(
    accountId: string,
    data: Partial<{ balance: string; currency: string }>
  ): Promise<IAccount | null>;
  create(data: {
    userId: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
  }): Promise<IAccount>;
}

export interface IAccountService {
  createAccount(userId: string): Promise<IAccount>;
  updateAccount(req: Request, dto: UpdateAccountDtoType): Promise<IAccount>;
  getAccount(req: Request): Promise<IAccount>;
  getAccounts(req: Request): Promise<IAccount[]>;
}
