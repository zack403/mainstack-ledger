import mongoose, { ClientSession } from 'mongoose';
import { EntryType, TransactionStatus, TransactionType } from '../enums';
import { ITransactionRepository } from '../types/transaction.type';
import { IAccountRepository } from '../types/account.type';

export async function withTransaction<T>(
  fn: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function executeTransaction(
  session: ClientSession,
  transactionRepo: ITransactionRepository,
  accountRepo: IAccountRepository,
  config: {
    type: TransactionType;
    fromAccountId: string;
    toAccountId: string;
    amount: string;
    currency: string;
    balanceBefore: string;
    balanceAfter: string;
    requestId: string;
    accountUpdates: { accountId: string; balance: string; version: number }[];
  }
) {
  const transaction = await transactionRepo.createTransaction(
    {
      type: config.type,
      fromAccountId: config.fromAccountId,
      toAccountId: config.toAccountId,
      amount: config.amount,
      balanceBefore: config.balanceBefore,
      balanceAfter: config.balanceAfter,
      currency: config.currency,
      status: TransactionStatus.COMPLETED,
      requestId: config.requestId,
    },
    session
  );

  await transactionRepo.createLedgerEntries(
    [
      {
        transactionId: transaction.transactionId,
        accountId: config.fromAccountId,
        amount: `-${config.amount}`,
        entryType: EntryType.DEBIT,
      },
      {
        transactionId: transaction.transactionId,
        accountId: config.toAccountId,
        amount: config.amount,
        entryType: EntryType.CREDIT,
      },
    ],
    session
  );

  for (const update of config.accountUpdates) {
    await accountRepo.update(
      update.accountId,
      { balance: update.balance },
      session
    );
  }

  return transaction.transactionId;
}
