import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

mongoose.connect(MONGODB_URL)
  .then(() => {
    app.use(express.json());

    app.post('/signin', login);
    app.post('/signup', createUser);

    app.use(auth);

    app.use('/users', usersRouter);
    app.use('/cards', cardsRouter);

    app.listen(PORT);
  })
  .catch(() => process.exit(1));
