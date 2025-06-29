import { NextFunction, Request, Response } from 'express';
import { Error as MongoError } from 'mongoose';
import * as errors from '../errors';
import StatusCodes from '../constants/status-codes';
import Card from '../models/card';

export const getAllCards = (_: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(() => {
      next(new Error());
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res
        .status(StatusCodes.CREATED)
        .json(card);
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.ValidationError) {
        next(new errors.BadRequestError('Переданы некорректные данные для создания карточки'));
      } else {
        next(new Error());
      }
    });
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new errors.NotFoundError('Карточка с указанным id не найдена'));
      } else if (card.owner.toString() !== req.user._id.toString()) {
        next(new errors.ForbiddenError('Нет доступа к карточке'));
      } else {
        res.json({ message: 'Карточка успешно удалена' });
      }
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.CastError) {
        next(new errors.BadRequestError('Передан некорректный id карточки'));
      } else {
        next(new Error());
      }
    });
};

export const setLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new errors.NotFoundError('Карточка с указанным id не найдена'));
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.ValidationError) {
        next(new errors.BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else if (err instanceof MongoError.CastError) {
        next(new errors.BadRequestError('Передан некорректный id карточки'));
      } else {
        next(new Error());
      }
    });
};

export const unsetLike = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new errors.NotFoundError('Карточка с указанным id не найдена'));
      } else {
        res.json(card);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.ValidationError) {
        next(new errors.BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else if (err instanceof MongoError.CastError) {
        next(new errors.BadRequestError('Передан некорректный id карточки'));
      } else {
        next(new Error());
      }
    });
};
