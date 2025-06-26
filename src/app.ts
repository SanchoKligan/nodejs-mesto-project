import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req: Request, _: Response, next: NextFunction) => {
  req.user = {
    _id: '685d484c9be32656b27b1562',
  };

  next();
});

app.use('/users', userRouter);

app.listen(PORT);
