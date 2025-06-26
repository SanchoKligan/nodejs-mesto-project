import { Request, Response } from 'express';
import User from '../models/user';

export function getAll(_: Request, res: Response) {
  User.find({})
    .then((users) => res.json(users));
}

export function getById(req: Request, res: Response) {
  User.findById(req.params.userId)
    .then((user) => res.json(user));
}

export function create(req: Request, res: Response) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.json(user));
}
