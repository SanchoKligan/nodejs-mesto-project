import { Router } from 'express';
import { getAll, deleteById, create } from '../controllers/cards';

const router = Router();

router.get('/', getAll);
router.post('/', create);

router.delete('/:cardId', deleteById);

export default router;
