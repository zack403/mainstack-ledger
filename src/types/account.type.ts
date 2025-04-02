import mongoose from 'mongoose';
import { UpdateAccountDtoType } from '../dtos/account.dto';
import { IAccount } from '../models/account.model';
import { Request } from 'express';
import { ITransaction } from '../models/transaction.model';

export interface IAccountRepository {
  create(account: { userId: string; accountNumber: string }): Promise<IAccount>;
  findById(accountId: string, userId: string): Promise<IAccount | null>;
  findByUserId(userId: string): Promise<IAccount[]>;
  getByAccountId(accountId: string): Promise<IAccount | null>;
  update(
    accountId: string,
    data: Partial<{ balance: string; currency: string; version?: number }>,
    session?: mongoose.ClientSession
  ): Promise<IAccount | null>;
  create(data: {
    userId: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
  }): Promise<IAccount>;
  findByAccountId(
    accountId: string,
    userId: string,
    filters?: {
      limit?: number;
      offset?: number;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any[]>;
}

export interface IAccountService {
  createAccount(userId: string): Promise<IAccount>;
  updateAccount(req: Request, dto: UpdateAccountDtoType): Promise<IAccount>;
  getAccount(req: Request): Promise<IAccount>;
  getAccounts(req: Request): Promise<IAccount[]>;
  listAccountTransactions(
    req: Request,
    accountId: string,
    filters?: {
      type?: string;
      tartDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<ITransaction[]>;
}
