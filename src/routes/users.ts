import { Router } from 'express';
import * as controller from '../controllers/users';

const router = Router();

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);

router.patch('/me', controller.updateProfile);
router.patch('/me/avatar', controller.updateAvatar);

router.get('/:userId', controller.getUserById);

export default router;
