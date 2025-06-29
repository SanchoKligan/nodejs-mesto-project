import { Request, Response } from 'express';
import StatusCodes from '../constants/status-codes';

interface ApiError extends Error {
  statusCode: number | undefined;
  message: string;
}

export default (err: ApiError, _: Request, res: Response) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = statusCode === 500
    ? 'На сервере произошла ошибка'
    : err.message;

  res.status(statusCode).json({ message });
};
