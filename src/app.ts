import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NotFoundError } from './errors';
import { userErrorMessages } from './constants/errors-messages';
import { createSchema as validationSchema } from './validators/user';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import errorHandler from './middlewares/error-handler';
import validateRequest from './middlewares/validation';

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

mongoose.connect(MONGODB_URL)
  .then(() => {
    app.use(helmet());
    app.use(limiter);
    app.use(express.json());
    app.use(cookieParser());

    app.use(logger.reqLogger);

    app.post(
      '/signin',
      validateRequest(
        validationSchema,
        userErrorMessages.LOGIN_UNAUTHORIZED,
      ),
      login,
    );
    app.post(
      '/signup',
      validateRequest(
        validationSchema,
        userErrorMessages.DATA_BAD_REQUEST,
      ),
      createUser,
    );

    app.use(auth);

    app.use('/users', usersRouter);
    app.use('/cards', cardsRouter);
    app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
      next(new NotFoundError('Такого пути не существует'));
    });

    app.use(logger.errLogger);

    app.use(errorHandler);

    app.listen(PORT);
  })
  .catch(() => process.exit(1));
