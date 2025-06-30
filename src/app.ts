import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
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

const app = express();

mongoose.connect(MONGODB_URL)
  .then(() => {
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

    app.use(errorHandler);

    app.use(logger.errLogger);

    app.listen(PORT);
  })
  .catch(() => process.exit(1));
