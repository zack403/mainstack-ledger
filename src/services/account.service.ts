import { Request } from 'express';
import { injectable, inject } from 'tsyringe';
import { AccountRepository } from '../repositories/account.repository';
import { UpdateAccountDtoType } from '../dtos/account.dto';
import logger from '../utils/logger.util';
import { AppError } from '../middlewares/error-handler.middleware';
import { TOKENS } from '../types/app.types';
import { IAccountService } from '../types/account.type';
import { IAccount } from '../models/account.model';
import { extractRequestContext } from '../utils/request-context.util';

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(TOKENS.AccountRepository)
    private readonly accountRepo: AccountRepository
  ) {}

  async listAccountTransactions(
    req: Request,
    accountId: string,
    filters: {
      type?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ) {
    const { userId } = extractRequestContext(req);
    const account = await this.accountRepo.findById(accountId, userId);
    if (!account) throw new AppError(404, 'Account not found');
    return await this.accountRepo.findByAccountId(accountId, userId, filters);
  }

  async createAccount(userId: string) {
    const accountNumber = `AC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const account = await this.accountRepo.create({
      userId,
      accountNumber,
    });

    logger.info('Account created', {
      accountId: account.accountId,
      accountNumber: account.accountNumber,
      userId,
    });

    return account;
  }

  async updateAccount(req: Request, dto: UpdateAccountDtoType) {
    const userId = req.context?.userId as string;
    const accountId = req.params.accountId;

    const account = await this.accountRepo.findById(accountId, userId);
    if (!account) {
      logger.warn('No account found for update', {
        accountId,
        userId,
      });
      throw new AppError(404, 'Account not found');
    }

    const updated = await this.accountRepo.update(accountId, dto);
    if (!updated) throw new AppError(500, 'Failed to update account');

    logger.info('Account updated', {
      requestId: req.context?.requestId,
      accountId,
    });
    return {
      accountId,
      balance: updated.balance,
      currency: updated.currency,
    } as IAccount;
  }

  async getAccount(req: Request) {
    const userId = req.context?.userId as string;
    const account = await this.accountRepo.findById(
      req.params.accountId,
      userId
    );
    if (!account) throw new AppError(404, 'Account not found');

    logger.info('Account retrieved', {
      requestId: req.context?.requestId,
      accountId: account.accountId,
    });
    return {
      accountId: account.accountId,
      balance: account.balance,
      currency: account.currency,
    } as IAccount;
  }

  async getAccounts(req: Request) {
    const userId = req.context?.userId as string;
    const accounts = await this.accountRepo.findByUserId(userId);
    if (!accounts.length) throw new AppError(404, 'Account not found');

    logger.info('Accounts retrieved', {
      requestId: req.context?.requestId,
      accounts,
    });
    return accounts;
  }
}
