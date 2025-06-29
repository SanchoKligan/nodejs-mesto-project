import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

const { JWT_KEY = 'secret-key' } = process.env;

export default (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }

  let payload: JwtPayload;

  try {
    payload = verify(token, JWT_KEY) as JwtPayload;

    req.user = payload;

    return next();
  } catch {
    return next(new UnauthorizedError('Требуется авторизация'));
  }
};
