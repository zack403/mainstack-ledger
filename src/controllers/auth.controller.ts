import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../types/app.types';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { ResponseUtil } from '../utils/response.util';
import { IAuthService } from '../types/auth.type';

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.AuthService) private readonly authService: IAuthService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const dto = RegisterDto.parse(req.body);
    const result = await this.authService.register(req, dto);
    ResponseUtil.success(res, {
      status: 201,
      data: result,
      message: 'User registered successfully',
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const dto = LoginDto.parse(req.body);
    const result = await this.authService.login(req, dto);
    ResponseUtil.success(res, {
      status: 200,
      data: result,
      message: 'Login successful',
    });
  }
}
