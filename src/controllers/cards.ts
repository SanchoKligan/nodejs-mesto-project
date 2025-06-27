import { Request, Response } from 'express';
import { Error } from 'mongoose';
import ErrorCodes from '../constants';
import Card from '../models/card';

export const getAllCards = async (_: Request, res: Response) => {
  await Card.find({})
    .then((cards) => res.json(cards))
    .catch(() => {
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'На сервере произошла ошибка' });
    });
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  await Card.create({ name, link, owner })
    .then((card) => res.json(card))
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const deleteCardById = async (req: Request, res: Response) => {
  await Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(ErrorCodes.NOT_FOUND)
          .json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json({ message: 'Карточка успешно удалена' });
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.CastError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id карточки' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
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
        res
          .status(ErrorCodes.NOT_FOUND)
          .json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err instanceof Error.CastError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id карточки' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
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
        res
          .status(ErrorCodes.NOT_FOUND)
          .json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err instanceof Error.CastError) {
        res
          .status(ErrorCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id карточки' });
      } else {
        res
          .status(ErrorCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};
