import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';

export default (
  schema: z.ZodSchema,
  source: 'body' | 'params',
  message: string,
) => (req: Request, _: Response, next: NextFunction) => {
  const data = source === 'body' ? req.body : req.params;
  const result = schema.safeParse(data);

  if (!result.success) {
    return next(new BadRequestError(message));
  }

  return next();
};
