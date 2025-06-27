import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const {
  PORT = 3000,
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

mongoose.connect(MONGODB_URL);

app.use(express.json());

app.use((req: Request, _: Response, next: NextFunction) => {
  req.user = {
    _id: '685e922ddfce7e5c7a8a21e1',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT);
