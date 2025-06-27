import { Request, Response } from 'express';
import { Error } from 'mongoose';
import Card from '../models/card';

export const getAllCards = async (_: Request, res: Response) => {
  await Card.find({})
    .then((cards) => res.json(cards))
    .catch(() => res.status(500).json({ message: 'Внутренняя ошибка сервера' }));
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  await Card.create({ name, link, owner })
    .then((card) => res.json(card))
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).json({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const deleteCardById = async (req: Request, res: Response) => {
  await Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json({ message: 'Карточка успешно удалена' });
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.CastError) {
        res.status(400).json({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const setLike = async (req: Request, res: Response) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).json({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err instanceof Error.CastError) {
        res.status(400).json({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

export const unsetLike = async (req: Request, res: Response) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res.status(400).json({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err instanceof Error.CastError) {
        res.status(400).json({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
      }
    });
};
