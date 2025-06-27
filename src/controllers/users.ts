import { Request, Response } from 'express';
import { Error } from 'mongoose';
import User from '../models/user';
import ErrorCodes from '../constants';

export const getAllUsers = async (_: Request, res: Response) => {
  await User.find({})
    .then((users) => res.json(users))
    .catch(() => {
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'На сервере произошла ошибка' });
    });
};

export const getUserById = async (req: Request, res: Response) => {
  await User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.CastError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id пользователя' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  await User.create({ name, about, avatar })
    .then((user) => res.json(user))
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для создания пользователя' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;

  await User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для обновления профиля' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;

  await User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для обновления аватара' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};
