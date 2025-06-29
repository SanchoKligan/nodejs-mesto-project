import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import StatusCodes from '../constants';

export default (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Требуется авторизация' });
  }

  let payload: JwtPayload;

  try {
    payload = verify(token, 'key') as JwtPayload;
  } catch {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Требуется авторизация' });
  }

  req.user = payload;

  return next();
};
