import { z } from 'zod';
import { AVATAR_REGEX, OBJECT_ID_REGEX } from '../constants/regex';

export const userParamsSchema = z.object({
  userId: z.string().regex(OBJECT_ID_REGEX),
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string().min(2).max(30).optional(),
  about: z.string().min(2).max(200).optional(),
  avatar: z.string().regex(AVATAR_REGEX).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(30).optional(),
  about: z.string().min(2).max(200).optional(),
  avatar: z.string().regex(AVATAR_REGEX).optional(),
});
