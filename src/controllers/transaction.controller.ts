import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../types/app.types';
import { ResponseUtil } from '../utils/response.util';
import {
  DepositDtoType,
  TransferDtoType,
  WithdrawalDtoType,
} from '../dtos/transaction.dto';
import { ITransactionService } from '../types/transaction.type';

@injectable()
export class TransactionController {
  constructor(
    @inject(TOKENS.TransactionService)
    private readonly transactionService: ITransactionService
  ) {}

  async deposit(req: Request, res: Response) {
    const dto = req.body as DepositDtoType;
    const result = await this.transactionService.deposit(req, dto);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Deposit successful',
    });
  }

  async withdraw(req: Request, res: Response) {
    const dto = req.body as WithdrawalDtoType;
    const result = await this.transactionService.withdraw(req, dto);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Withdrawal successful',
    });
  }

  async transfer(req: Request, res: Response) {
    const dto = req.body as TransferDtoType;
    const result = await this.transactionService.transfer(req, dto);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Transfer successful',
    });
  }

  async getTransaction(req: Request, res: Response) {
    const { transactionId } = req.params;
    const transaction = await this.transactionService.getTransaction(
      req,
      transactionId
    );
    ResponseUtil.success(res, {
      status: 200,
      data: transaction,
      message: 'Transaction retrieved',
    });
  }

  async listUserTransactions(req: Request, res: Response) {
    const filters = {
      type: req.query.type as string,
      limit: parseInt(req.query.limit as string) || 10,
      offset: parseInt(req.query.offset as string) || 0,
    };
    const transactions = await this.transactionService.listUserTransactions(
      req,
      filters
    );
    ResponseUtil.success(res, {
      status: 200,
      data: transactions,
      message: 'Transactions retrieved',
    });
  }

  async getTransactionsLedger(req: Request, res: Response) {
    const transactionsLedgers =
      await this.transactionService.getTransactionsLedger(
        req,
        req.params.transactionId
      );
    ResponseUtil.success(res, {
      status: 200,
      data: transactionsLedgers,
      message: 'Transactions retrieved',
    });
  }
}
