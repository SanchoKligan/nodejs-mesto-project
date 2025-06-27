import { Request, Response } from 'express';
import { Error } from 'mongoose';
import User from '../models/user';

export const getAllUsers = async (_: Request, res: Response) => {
  await User.find({})
    .then((users) => res.json(users))
    .catch(() => res.status(500).json({ message: 'Внутренняя ошибка сервера' }));
};

export const getUserById = async (req: Request, res: Response) => {
  await User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.CastError) {
        res.status(400).json({ message: 'Передан некорректный id пользователя' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  await User.create({ name, about, avatar })
    .then((user) => res.json(user))
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).json({ message: 'Переданы некорретные данные для создания пользователя' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;

  await User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).json({ message: 'Переданы некорретные данные для обновления профиля' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;

  await User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).json({ message: 'Переданы некорретные данные для обновления аватара' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
