import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User from '../models/user';
import StatusCodes from '../constants';

export const getAllUsers = (_: Request, res: Response) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() => {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'На сервере произошла ошибка' });
    });
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id пользователя' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const createUser = (req: Request, res: Response) => {
  const { password, ...restBody } = req.body;

  hash(password, 10)
    .then((pass) => User.create({ password: pass, ...restBody }))
    .then((user) => {
      res
        .status(StatusCodes.CREATED)
        .json(user);
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для создания пользователя' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const updateProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для обновления профиля' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для обновления аватара' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = sign({ _id: user?._id }, 'key', { expiresIn: '7d' });

      res.cookie('token', token, { httpOnly: true });
    })
    .catch(() => {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Ошибка авторизации' });
    });
};
