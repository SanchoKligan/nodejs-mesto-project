import { z } from 'zod';
import { AVATAR_REGEX, OBJECT_ID_REGEX } from '../constants/regex-patterns';

export const paramsSchema = z.object({
  cardId: z.string().regex(OBJECT_ID_REGEX),
});

export const bodySchema = z.object({
  name: z.string().min(2).max(30),
  link: z.string().regex(AVATAR_REGEX),
  owner: z.string().regex(OBJECT_ID_REGEX),
  likes: z.array(z.string().regex(OBJECT_ID_REGEX)).optional(),
  createdAt: z.date().optional(),
});
