import { Router } from 'express';
import * as controller from '../controllers/cards';

const router = Router();

router.get('/', controller.getAllCards);
router.post('/', controller.createCard);

router.delete('/:cardId', controller.deleteCardById);

router.put('/:cardId/likes', controller.setLike);
router.delete('/:cardId/likes', controller.unsetLike);

export default router;
