import { Request, Response, NextFunction } from 'express';

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, message: string, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  console.error('Unhandled Error:', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred on the server.',
    },
  });
}
