import mongoose from 'mongoose';
import { AccountModel, IAccount } from '../models/account.model';
import { IAccountRepository } from '../types/account.type';
import { TransactionModel } from '../models/transaction.model';
import { AppError } from '../middlewares/error-handler.middleware';

export class AccountRepository implements IAccountRepository {
  async create(account: { userId: string; accountNumber: string }) {
    return AccountModel.create(account);
  }

  async findById(accountId: string, userId: string) {
    return AccountModel.findOne({ accountId, userId }).exec();
  }

  async findByUserId(userId: string) {
    const accounts = await AccountModel.find({ userId }).exec();
    return accounts;
  }

  async getByAccountId(accountId: string): Promise<IAccount | null> {
    const account = await AccountModel.findOne({ accountId }).exec();
    return account;
  }

  async findByAccountId(
    accountId: string,
    userId: string,
    { limit = 10, offset = 0 } = {}
  ) {
    const account = await AccountModel.findOne({ accountId, userId }).exec();
    if (!account) return [];
    const query = {
      $or: [{ fromAccountId: accountId }, { toAccountId: accountId }],
    };
    return TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .select('transactionId type amount currency status createdAt')
      .exec();
  }

  async update(
    accountId: string,
    data: Partial<{ balance: string; currency: string; version?: number }>,
    session?: mongoose.ClientSession
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = {} as any;
    query.accountId = accountId;
    if (data.version !== undefined) {
      query.version = data.version;
    }

    const update = {
      $set: { balance: data.balance, currency: data.currency },
      $inc: { version: 1 },
    };
    const result = await AccountModel.findOneAndUpdate(query, update, {
      new: true,
      session,
    }).exec();
    if (!result)
      throw new AppError(
        409,
        'Concurrency conflict - account updated by another operation'
      );
    return result;
  }
}
