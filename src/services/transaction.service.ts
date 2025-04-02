import { Request } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../types/app.types';
import logger from '../utils/logger.util';
import {
  ITransactionRepository,
  ITransactionService,
} from '../types/transaction.type';
import { IAccountRepository } from '../types/account.type';
import {
  DepositDtoType,
  TransferDtoType,
  WithdrawalDtoType,
} from '../dtos/transaction.dto';
import { AppError } from '../middlewares/error-handler.middleware';
import { AccountStatus, TransactionType } from '../enums';
import { ITransaction } from '../models/transaction.model';
import { extractRequestContext } from '../utils/request-context.util';
import { executeTransaction, withTransaction } from '../utils/transaction.util';
import { IAccount } from '../models/account.model';

@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject(TOKENS.AccountRepository)
    private readonly accountRepo: IAccountRepository,
    @inject(TOKENS.TransactionRepository)
    private readonly transactionRepo: ITransactionRepository
  ) {}

  async deposit(
    req: Request,
    dto: DepositDtoType
  ): Promise<Partial<ITransaction>> {
    const { userId, requestId, idempotencyKey } = extractRequestContext(req);
    const { amount: amountNum, toAccountId } = dto;
    const amount = this.normalizeAmount(amountNum);

    await this.handleIdempotency(requestId, idempotencyKey);

    return withTransaction(async (session) => {
      const account = await this.getAccount(toAccountId, userId);
      this.checkAccountStatus(account);

      const { balanceBefore, balanceAfter } = this.calculateBalances(
        account.balance,
        amount
      );

      const transactionId = await executeTransaction(
        session,
        this.transactionRepo,
        this.accountRepo,
        {
          type: TransactionType.DEPOSIT,
          fromAccountId: 'system',
          toAccountId: account.accountId,
          amount,
          currency: account.currency,
          balanceBefore,
          balanceAfter,
          requestId: idempotencyKey,
          accountUpdates: [
            { accountId: account.accountId, balance: balanceAfter },
          ],
        }
      );

      logger.info('Deposit completed', { transactionId });

      return {
        transactionId,
        amount,
        currency: account.currency,
      };
    });
  }

  async withdraw(
    req: Request,
    dto: WithdrawalDtoType
  ): Promise<Partial<ITransaction>> {
    const { userId, requestId, idempotencyKey } = extractRequestContext(req);
    const { amount: amountNum, fromAccountId } = dto;
    const amount = this.normalizeAmount(amountNum);

    await this.handleIdempotency(requestId, idempotencyKey);

    return withTransaction(async (session) => {
      const account = await this.getAccount(fromAccountId, userId);

      const { balanceBefore, balanceAfter } = this.calculateBalances(
        account.balance,
        `-${amount}`
      );

      this.checkAccountStatus(account);

      if (parseFloat(balanceAfter) < 0)
        throw new AppError(400, 'Insufficient funds');

      // TODO minimum balance & transaction limit

      const transactionId = await executeTransaction(
        session,
        this.transactionRepo,
        this.accountRepo,
        {
          type: TransactionType.WITHDRAWAL,
          fromAccountId: account.accountId,
          toAccountId: 'system',
          amount,
          currency: account.currency,
          balanceBefore,
          balanceAfter,
          requestId: idempotencyKey,
          accountUpdates: [
            { accountId: account.accountId, balance: balanceAfter },
          ],
        }
      );

      logger.info('Withdrawal completed', { transactionId });

      return { transactionId, amount, currency: account.currency };
    });
  }

  async transfer(
    req: Request,
    dto: TransferDtoType
  ): Promise<Partial<ITransaction>> {
    const { userId, requestId, idempotencyKey } = extractRequestContext(req);
    const { amount: amountNum, fromAccountId, toAccountId } = dto;
    const amount = this.normalizeAmount(amountNum);

    await this.handleIdempotency(requestId, idempotencyKey);

    return withTransaction(async (session) => {
      const fromAccount = await this.getAccount(fromAccountId, userId);
      if (!fromAccount) throw new AppError(404, 'From account not found');

      const toAccount = await this.accountRepo.getByAccountId(toAccountId);
      if (!toAccount) throw new AppError(404, 'To account not found');

      if (fromAccount.currency !== toAccount.currency)
        throw new AppError(400, 'Currency mismatch');

      const fromBalanceBefore = fromAccount.balance;
      const fromBalanceAfter = this.calculateBalances(
        fromBalanceBefore,
        `-${amount}`
      ).balanceAfter;

      this.checkAccountStatus(fromAccount);
      this.checkAccountStatus(toAccount);

      if (fromAccountId === toAccountId) {
        throw new AppError(400, 'Cannot transfer to the same account.');
      }

      if (parseFloat(fromBalanceAfter) < 0)
        throw new AppError(400, 'Insufficient funds');

      // TODO minimum balance & transaction limit

      const toBalanceBefore = toAccount.balance;
      const toBalanceAfter = this.calculateBalances(
        toBalanceBefore,
        amount
      ).balanceAfter;

      const transactionId = await executeTransaction(
        session,
        this.transactionRepo,
        this.accountRepo,
        {
          type: TransactionType.TRANSFER,
          fromAccountId: fromAccount.accountId,
          toAccountId: toAccount.accountId,
          amount,
          currency: fromAccount.currency,
          balanceBefore: fromBalanceBefore,
          balanceAfter: fromBalanceAfter,
          requestId: idempotencyKey,
          accountUpdates: [
            { accountId: fromAccount.accountId, balance: fromBalanceAfter },
            { accountId: toAccount.accountId, balance: toBalanceAfter },
          ],
        }
      );

      logger.info('Transfer completed', { transactionId });

      return {
        transactionId,
        amount,
        currency: fromAccount.currency,
      };
    });
  }

  async getTransaction(
    req: Request,
    transactionId: string
  ): Promise<ITransaction> {
    const { userId } = extractRequestContext(req);
    const transaction = await this.transactionRepo.findById(
      transactionId,
      userId
    );
    if (!transaction) throw new AppError(404, 'Transaction not found');
    return transaction;
  }

  async listUserTransactions(
    req: Request,
    filters: { type?: string; limit?: number; offset?: number }
  ): Promise<ITransaction[]> {
    const { userId } = extractRequestContext(req);
    return this.transactionRepo.findByUserId(userId, filters);
  }

  async getTransactionsLedger(req: Request, transactionId: string) {
    const { userId } = extractRequestContext(req);
    return this.transactionRepo.getTransactionsLedger(userId, transactionId);
  }

  private async getAccount(accountId: string, userId: string) {
    const account = await this.accountRepo.findById(accountId, userId);
    if (!account) throw new AppError(404, 'Account not found');
    return account;
  }

  private calculateBalances(balanceBefore: string, amount: string) {
    const balanceBeforeNum = parseFloat(balanceBefore);
    const amountNum = parseFloat(amount);
    return {
      balanceBefore,
      balanceAfter: (balanceBeforeNum + amountNum).toFixed(2),
    };
  }

  private async handleIdempotency(
    requestId: string,
    idempotencyKey: string
  ): Promise<void> {
    const existing = await this.transactionRepo.findByRequestId(idempotencyKey);
    if (existing) {
      logger.info('Duplicate request detected', { requestId, idempotencyKey });
      throw new AppError(409, 'Duplicate request detected');
    }
  }

  private normalizeAmount(amountNum: number): string {
    return amountNum.toFixed(2);
  }

  private checkAccountStatus(account: IAccount) {
    if (account.status !== AccountStatus.ACTIVE)
      throw new AppError(400, 'Account is not active');
  }
}
