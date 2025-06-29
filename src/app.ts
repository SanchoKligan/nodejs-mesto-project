import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import errorHandler from './middlewares/error-handler';

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

mongoose.connect(MONGODB_URL)
  .then(() => {
    app.use(express.json());

    app.use(logger.reqLogger);

    app.post('/signin', login);
    app.post('/signup', createUser);

    app.use(auth);

    app.use('/users', usersRouter);
    app.use('/cards', cardsRouter);

    app.use(errorHandler);

    app.use(logger.errLogger);

    app.listen(PORT);
  })
  .catch(() => process.exit(1));
