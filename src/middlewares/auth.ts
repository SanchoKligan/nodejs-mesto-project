import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import StatusCodes from '../constants';

export default (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies.token;

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Требуется авторизация' });

    return;
  }

  let payload: JwtPayload;

  try {
    payload = verify(token, 'key') as JwtPayload;
  } catch {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Требуется авторизация' });

    return;
  }

  req.user = payload;

  next();
};
