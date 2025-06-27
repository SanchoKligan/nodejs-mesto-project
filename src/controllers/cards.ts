import { Request, Response } from 'express';
import Card from '../models/card';

export const getAllCards = async (_: Request, res: Response) => {
  await Card.find({})
    .then((cards) => res.json(cards));
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  await Card.create({ name, link, owner })
    .then((card) => res.json(card));
};

export const deleteCardById = async (req: Request, res: Response) => {
  await Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.json({ message: 'Карточка успешно удалена' }));
};

export const setLike = async (req: Request, res: Response) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => res.json(card));
};

export const unsetLike = async (req: Request, res: Response) => {
  await Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => res.json(card));
};
