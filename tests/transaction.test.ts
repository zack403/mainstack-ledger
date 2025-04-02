/* eslint-disable @typescript-eslint/no-explicit-any */
import { TOKENS } from '../src/types/app.types';
import sinon from 'sinon';
import mongoose from 'mongoose';
import {
  ITransactionRepository,
  ITransactionService,
} from '../src/types/transaction.type';
import { IAccountRepository } from '../src/types/account.type';
import { AccountRepository } from '../src/repositories/account.repository';
import { TransactionRepository } from '../src/repositories/transaction.repository';
import { AccountStatus, Currency } from '../src/enums';
import container from '../src/container';

describe('TransactionService', () => {
  let transactionService: ITransactionService;
  let accountRepoStub: sinon.SinonStubbedInstance<IAccountRepository>;
  let transactionRepoStub: sinon.SinonStubbedInstance<ITransactionRepository>;

  beforeEach(() => {
    accountRepoStub = sinon.createStubInstance(AccountRepository as any);
    transactionRepoStub = sinon.createStubInstance(
      TransactionRepository as any
    );

    accountRepoStub.findByUserId.resolves([
      {
        accountId: 'acc-1',
        userId: 'usr-1',
        balance: '100.00',
        currency: Currency.NGN,
        status: AccountStatus.ACTIVE,
      } as any,
    ]);
    accountRepoStub.findById.withArgs('acc-1', 'usr-1').resolves({
      accountId: 'acc-1',
      userId: 'usr-1',
      balance: '100.00',
      currency: Currency.NGN,
      status: AccountStatus.ACTIVE,
    } as any);
    accountRepoStub.findByAccountId.withArgs('acc-2').resolves({
      accountId: 'acc-2',
      balance: '50.00',
      currency: Currency.NGN,
      status: AccountStatus.ACTIVE,
    } as any);
    accountRepoStub.findByAccountId.withArgs('acc-3').resolves(null);
    accountRepoStub.update.resolves();

    transactionRepoStub.createTransaction.resolves({
      transactionId: 'txn-1',
    } as any);
    transactionRepoStub.createLedgerEntries.resolves([]);
    transactionRepoStub.findByRequestId.resolves(null);

    container.register(TOKENS.AccountRepository, { useValue: accountRepoStub });
    container.register(TOKENS.TransactionRepository, {
      useValue: transactionRepoStub,
    });
    transactionService = container.resolve(TOKENS.TransactionService);

    sinon.stub(mongoose, 'startSession').resolves({
      startTransaction: sinon.stub(),
      commitTransaction: sinon.stub().resolves(),
      abortTransaction: sinon.stub().resolves(),
      endSession: sinon.stub(),
    } as any);
  });

  afterEach(() => {
    sinon.restore();
    container.clearInstances();
  });

  describe('deposit', () => {
    it('should deposit funds', async () => {
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 50, toAccountId: 'acc-1' };
      const result = await transactionService.deposit(req, dto);

      expect(result.transactionId).toBe('txn-1');
      expect(result.amount).toBe('50.00');
      expect(
        accountRepoStub.update.calledWith('acc-1', { balance: '150.00' })
      ).toBe(true);
    });

    it('should return existing transaction for duplicate idempotency key', async () => {
      transactionRepoStub.findByRequestId.withArgs('idem-1').resolves({
        transactionId: 'txn-old',
        amount: '50.00',
        currency: Currency.NGN,
      } as any);
      const req = {
        context: {
          userId: 'usr-1',
          requestId: 'req-1',
          idempotencyKey: 'idem-1',
        },
      } as any;
      const dto = { amount: 50, toAccountId: 'acc-1' };
      const result = await transactionService.deposit(req, dto);

      expect(result.transactionId).toBe('txn-old');
      expect(accountRepoStub.update.notCalled).toBe(true);
    });

    it('should fail if account is inactive', async () => {
      accountRepoStub.findById.withArgs('acc-1', 'usr-1').resolves({
        accountId: 'acc-1',
        status: AccountStatus.INACTIVE,
      } as any);
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 50, toAccountId: 'acc-1' };
      await expect(transactionService.deposit(req, dto)).rejects.toThrow(
        'Account is not active'
      );
    });
  });

  describe('withdraw', () => {
    it('should withdraw funds', async () => {
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 30, fromAccountId: 'acc-1' };
      const result = await transactionService.withdraw(req, dto);

      expect(result.transactionId).toBe('txn-1');
      expect(
        accountRepoStub.update.calledWith('acc-1', { balance: '70.00' })
      ).toBe(true);
    });

    it('should fail on insufficient funds', async () => {
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 200, fromAccountId: 'acc-1' };
      await expect(transactionService.withdraw(req, dto)).rejects.toThrow(
        'Insufficient funds'
      );
    });

    it('should return existing transaction for duplicate idempotency key', async () => {
      transactionRepoStub.findByRequestId.withArgs('idem-1').resolves({
        transactionId: 'txn-old',
        amount: '30.00',
        currency: Currency.NGN,
      } as any);
      const req = {
        context: {
          userId: 'usr-1',
          requestId: 'req-1',
          idempotencyKey: 'idem-1',
        },
      } as any;
      const dto = { amount: 30, fromAccountId: 'acc-1' };
      const result = await transactionService.withdraw(req, dto);

      expect(result.transactionId).toBe('txn-old');
    });
  });

  describe('transfer', () => {
    it('should transfer funds', async () => {
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 20, fromAccountId: 'acc-1', toAccountId: 'acc-2' };
      const result = await transactionService.transfer(req, dto);

      expect(result.transactionId).toBe('txn-1');
      expect(
        accountRepoStub.update.calledWith('acc-1', { balance: '80.00' })
      ).toBe(true);
      expect(
        accountRepoStub.update.calledWith('acc-2', { balance: '70.00' })
      ).toBe(true);
    });

    it('should fail on currency mismatch', async () => {
      accountRepoStub.findByAccountId.withArgs('acc-2').resolves({
        accountId: 'acc-2',
        currency: 'USD',
        status: AccountStatus.ACTIVE,
      });
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 20, fromAccountId: 'acc-1', toAccountId: 'acc-2' };
      await expect(transactionService.transfer(req, dto)).rejects.toThrow(
        'Currency mismatch'
      );
    });

    it('should fail if accounts are the same', async () => {
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 20, fromAccountId: 'acc-1', toAccountId: 'acc-1' };
      await expect(transactionService.transfer(req, dto)).rejects.toThrow(
        'Cannot transfer to the same account'
      );
    });

    it('should fail if to-account not found', async () => {
      accountRepoStub.findByAccountId.withArgs('acc-3').resolves(null);
      const req = { context: { userId: 'usr-1', requestId: 'req-1' } } as any;
      const dto = { amount: 20, fromAccountId: 'acc-1', toAccountId: 'acc-3' };
      await expect(transactionService.transfer(req, dto)).rejects.toThrow(
        'To account not found'
      );
    });
  });
});
