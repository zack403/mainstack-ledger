import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../types/app.types';
import { ResponseUtil } from '../utils/response.util';
import { UpdateAccountDtoType } from '../dtos/account.dto';
import { IAccountService } from '../types/account.type';

@injectable()
export class AccountController {
  constructor(
    @inject(TOKENS.AccountService)
    private readonly accountService: IAccountService
  ) {}

  async updateAccount(req: Request, res: Response): Promise<void> {
    const dto = req.body as UpdateAccountDtoType;
    const result = await this.accountService.updateAccount(req, dto);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Account updated successfully',
    });
  }

  async getAccounts(req: Request, res: Response): Promise<void> {
    const result = await this.accountService.getAccounts(req);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Account retrieved successfully',
    });
  }

  async getAccount(req: Request, res: Response): Promise<void> {
    const result = await this.accountService.getAccount(req);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Account retrieved successfully',
    });
  }
}
