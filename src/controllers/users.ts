import { NextFunction, Request, Response } from 'express';
import { mongo, Error as MongoError } from 'mongoose';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import User from '../models/user';
import StatusCodes from '../constants/status-codes';
import * as errors from '../errors';
import { userErrorMessages } from '../constants/errors-messages';

const { JWT_KEY = 'secret-key' } = process.env;

export const getAllUsers = (_: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(() => {
      next(new Error());
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new errors.NotFoundError(userErrorMessages.ID_NOT_FOUND));
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.CastError) {
        next(new errors.BadRequestError(userErrorMessages.ID_BAD_REQUEST));
      } else {
        next(new Error());
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { password, ...restBody } = req.body;

  hash(password, 10)
    .then((pass) => User.create({ password: pass, ...restBody }))
    .then((user) => {
      res
        .status(StatusCodes.CREATED)
        .json(user);
    })
    .catch((err: unknown) => {
      if (err instanceof mongo.MongoServerError && err.code === 11000) {
        next(new errors.ConflictError(userErrorMessages.EMAIL_CONFLICT));
      } else if (err instanceof MongoError.ValidationError) {
        next(new errors.BadRequestError(userErrorMessages.DATA_BAD_REQUEST));
      } else {
        next(new Error());
      }
    });
};

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new errors.NotFoundError(userErrorMessages.ID_NOT_FOUND));
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.ValidationError) {
        next(new errors.BadRequestError(userErrorMessages.PROFILE_BAD_REQUEST));
      } else {
        next(new Error());
      }
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new errors.NotFoundError(userErrorMessages.ID_NOT_FOUND));
      } else {
        res.json(user);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof MongoError.ValidationError) {
        next(new errors.BadRequestError(userErrorMessages.AVATAR_BAD_REQUEST));
      } else {
        next(new Error());
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = sign({ _id: user?._id }, JWT_KEY, { expiresIn: '7d' });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.json(user);
    })
    .catch((err: errors.UnauthorizedError) => {
      next(err);
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => res.json(user))
    .catch(() => {
      next(new Error());
    });
};
