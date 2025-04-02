import { AccountModel } from '../models/account.model';
import { IAccountRepository } from '../types/account.type';

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

  async update(
    accountId: string,
    data: Partial<{ balance: string; currency: string }>
  ) {
    const account = await AccountModel.findOneAndUpdate({ accountId }, data, {
      new: true,
    }).exec();
    return account;
  }
}
