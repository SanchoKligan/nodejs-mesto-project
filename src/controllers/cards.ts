import { Request, Response } from 'express';
import { Error } from 'mongoose';
import StatusCodes from '../constants/status-codes';
import Card from '../models/card';

export const getAllCards = (_: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(() => {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'На сервере произошла ошибка' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res
        .status(StatusCodes.CREATED)
        .json(card);
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Карточка с указанным id не найдена' });
      } else if (card.owner.toString() !== req.user._id.toString()) {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Нет доступа к карточке' });
      } else {
        res.json({ message: 'Карточка успешно удалена' });
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id карточки' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const setLike = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err instanceof Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id карточки' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};

export const unsetLike = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err instanceof Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Передан некорректный id карточки' });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: 'На сервере произошла ошибка' });
      }
    });
};
