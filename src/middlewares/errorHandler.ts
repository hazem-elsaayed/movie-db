import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError.js';

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  res.status(statusCode).json({ error: err.message });
};
