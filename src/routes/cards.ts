import { Router } from 'express';
import { cardErrorMessages } from '../constants/errors-messages';
import * as controller from '../controllers/cards';
import * as validationSchemas from '../validators/card';
import validateRequest from '../middlewares/validation';

const router = Router();

router.get('/', controller.getAllCards);

router.post(
  '/',
  validateRequest(
    validationSchemas.bodySchema,
    cardErrorMessages.DATA_BAD_REQUEST,
  ),
  controller.createCard,
);

router.put(
  '/:cardId/likes',
  validateRequest(
    validationSchemas.paramsSchema,
    cardErrorMessages.ID_BAD_REQUEST,
  ),
  controller.setLike,
);

router.delete(
  '/:cardId',
  validateRequest(
    validationSchemas.paramsSchema,
    cardErrorMessages.ID_BAD_REQUEST,
  ),
  controller.deleteCardById,
);
router.delete(
  '/:cardId/likes',
  validateRequest(
    validationSchemas.paramsSchema,
    cardErrorMessages.ID_BAD_REQUEST,
  ),
  controller.unsetLike,
);

export default router;
