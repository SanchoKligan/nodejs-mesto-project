import { Request, Response } from 'express';
import User from '../models/user';

export const getAllUsers = async (_: Request, res: Response) => {
  await User.find({})
    .then((users) => res.json(users));
};

export const getUserById = async (req: Request, res: Response) => {
  await User.findById(req.params.userId)
    .then((user) => res.json(user));
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  await User.create({ name, about, avatar })
    .then((user) => res.json(user));
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;

  await User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true })
    .then((user) => res.json(user));
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;

  await User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true })
    .then((user) => res.json(user));
};
