import { inject, injectable } from 'tsyringe';
import { ITransaction, TransactionModel } from '../models/transaction.model';
import { ILedgerEntry, LedgerEntryModel } from '../models/ledger-entry.model';
import { ITransactionRepository } from '../types/transaction.type';
import { IAccount } from '../models/account.model';
import { TOKENS } from '../types/app.types';
import { IAccountRepository } from '../types/account.type';

@injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @inject(TOKENS.AccountRepository)
    private readonly accountRepo: IAccountRepository
  ) {}

  async createTransaction(data: {
    balanceBefore: string;
    balanceAfter: string;
    amount: string;
    currency: string;
    type: string;
    status: string;
    requestId: string;
    fromAccountId: string;
    toAccountId: string;
  }) {
    const transaction = await TransactionModel.create(data);
    return transaction;
  }

  async createLedgerEntries(entries: ILedgerEntry[]) {
    const ledgerEntries = await LedgerEntryModel.create(entries);
    return ledgerEntries;
  }

  async getTransactionsLedger(transactionId: string, userId: string) {
    const transaction = await TransactionModel.findOne({
      transactionId,
    }).exec();

    if (!transaction || !transaction.fromAccountId || !transaction.toAccountId)
      return [];

    const fromAccount = await this.accountRepo.findById(
      transaction.fromAccountId,
      userId
    );
    const toAccount = await this.accountRepo.findById(
      transaction.toAccountId,
      userId
    );

    if (!fromAccount && !toAccount) return [];

    return LedgerEntryModel.find({ transactionId })
      .select('entryId transactionId accountId amount entryType createdAt')
      .exec();
  }

  async findByRequestId(requestId: string): Promise<ITransaction | null> {
    const transaction = await TransactionModel.findOne({ requestId });
    return transaction;
  }

  async findById(transactionId: string, userId: string) {
    const transaction = await TransactionModel.findOne({
      transactionId,
    }).exec();
    if (!transaction) return null;

    const fromAccount = await this.accountRepo.findById(
      transaction.fromAccountId as string,
      userId
    );
    const toAccount = await this.accountRepo.findById(
      transaction.toAccountId as string,
      userId
    );

    if (!fromAccount || fromAccount.userId !== userId) {
      return null;
    }

    return {
      ...transaction.toObject(),
      fromAccount: fromAccount
        ? { accountId: fromAccount.accountId, userId: fromAccount.userId }
        : null,
      toAccount: toAccount
        ? { accountId: toAccount.accountId, userId: toAccount.userId }
        : null,
    };
  }

  async findByUserId(userId: string, { limit = 10, offset = 0 } = {}) {
    const accounts = await this.accountRepo.findByUserId(userId);
    const accountIds = accounts.map((acc: IAccount) => acc.accountId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      $or: [
        { fromAccountId: { $in: accountIds } },
        { toAccountId: { $in: accountIds } },
      ],
    };
    return TransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .select('transactionId type amount currency status createdAt')
      .exec();
  }
}
