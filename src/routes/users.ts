import { Router } from 'express';
import { userErrorMessages } from '../constants/errors-messages';
import * as controller from '../controllers/users';
import validateRequest from '../middlewares/validation';
import * as validationSchemas from '../validators/user';

const router = Router();

router.get('/', controller.getAllUsers);
router.get('/me', controller.getCurrentUser);
router.get(
  '/:userId',
  validateRequest(
    validationSchemas.paramsSchema,
    userErrorMessages.ID_BAD_REQUEST,
    'params',
  ),
  controller.getUserById,
);

router.patch(
  '/me',
  validateRequest(
    validationSchemas.updateSchema,
    userErrorMessages.PROFILE_BAD_REQUEST,
  ),
  controller.updateProfile,
);
router.patch(
  '/me/avatar',
  validateRequest(
    validationSchemas.updateSchema,
    userErrorMessages.AVATAR_BAD_REQUEST,
  ),
  controller.updateAvatar,
);

export default router;
