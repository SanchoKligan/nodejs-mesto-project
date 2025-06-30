import { NextFunction, Request, Response } from 'express';
import StatusCodes from '../constants/status-codes';

interface ApiError extends Error {
  statusCode: number | undefined;
  message: string;
}

// eslint-disable-next-line no-unused-vars
export default (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = statusCode === 500
    ? 'На сервере произошла ошибка'
    : err.message;

  res.status(statusCode).json({ message });
};
