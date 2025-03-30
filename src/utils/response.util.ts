import { Response } from 'express';

interface ApiResponse<T> {
  status: number;
  success: boolean;
  data?: T;
  message?: string;
}

interface ResponseOptions<T> {
  status: number;
  data?: T;
  message?: string;
}

export class ResponseUtil {
  static success<T>(res: Response, options: ResponseOptions<T>): Response {
    const { status, data, message } = options;
    return res.status(status).json({
      status,
      success: true,
      data: data ?? null,
      message: message ?? 'Success',
    } as ApiResponse<T>);
  }

  static error(res: Response, status: number, message: string): Response {
    return res.status(status).json({
      status,
      success: false,
      message: message || 'An error occurred',
    } as ApiResponse<never>);
  }
}
