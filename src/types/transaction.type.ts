import { Request } from 'express';
import {
  DepositDtoType,
  TransferDtoType,
  WithdrawalDtoType,
} from '../dtos/transaction.dto';
import { ITransaction } from '../models/transaction.model';
import { ILedgerEntry } from '../models/ledger-entry.model';
import mongoose from 'mongoose';

export interface ITransactionRepository {
  createTransaction(
    data: {
      balanceBefore: string;
      balanceAfter: string;
      amount: string;
      currency: string;
      type: string;
      status: string;
      requestId: string;
      fromAccountId: string;
      toAccountId: string;
    },
    session?: mongoose.ClientSession
  ): Promise<ITransaction>;

  createLedgerEntries(
    entries: {
      transactionId: string;
      accountId: string;
      amount: string;
      entryType: string;
    }[],
    session?: mongoose.ClientSession
  ): Promise<ILedgerEntry[]>;

  getTransactionsLedger(
    userId: string,
    transactionId: string
  ): Promise<ILedgerEntry[]>;

  findByRequestId(requestId: string): Promise<ITransaction | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findById(transactionId: string, userId: string): Promise<any>;
  findByUserId(
    userId: string,
    filters?: { limit?: number; offset?: number }
  ): Promise<ITransaction[] | []>;
}

export interface ITransactionService {
  deposit(req: Request, dto: DepositDtoType): Promise<Partial<ITransaction>>;
  withdraw(
    req: Request,
    dto: WithdrawalDtoType
  ): Promise<Partial<ITransaction>>;
  transfer(req: Request, dto: TransferDtoType): Promise<Partial<ITransaction>>;
  getTransaction(req: Request, transactionId: string): Promise<ITransaction>;
  listUserTransactions(
    req: Request,
    filters: { type?: string; limit?: number; offset?: number }
  ): Promise<ITransaction[]>;
  getTransactionsLedger(
    req: Request,
    transactionId: string
  ): Promise<ILedgerEntry[]>;
}
