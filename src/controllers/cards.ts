import { Request, Response } from 'express';
import Card from '../models/card';

export function getAll(_: Request, res: Response) {
  Card.find({})
    .then((cards) => res.json(cards));
}

export function create(req: Request, res: Response) {
  const { name, link } = req.body;
  const owner = req.user?._id;

  Card.create({ name, link, owner })
    .then((card) => res.json(card));
}

export function deleteById(req: Request, res: Response) {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.json({ message: 'Карточка успешно удалена' }));
}
