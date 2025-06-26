import { Router } from 'express';
import { getAll, getById, create } from '../controllers/users';

const router = Router();

router.get('/', getAll);
router.post('/', create);

router.get('/:userId', getById);

export default router;
