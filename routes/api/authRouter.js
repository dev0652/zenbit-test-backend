import express from 'express';
import { validateBody } from '../../decorators/index.js';
import { usersSchemas as schemas } from '../../schemas/index.js';
import { authController as controller } from '../../controllers/index.js';
import { authenticate } from '../../middleware/index.js';

// ####################################################

const authRouter = express.Router();

authRouter.post(
  '/users/signup',
  validateBody(schemas.registerSchema),
  controller.register
);

authRouter.get('/verify/:verificationToken', controller.verify);

authRouter.post(
  '/users/login',
  validateBody(schemas.loginSchema),
  controller.login
);

authRouter.get(
  '/users/current',
  authenticate,
  authenticate,
  controller.getCurrent
);

authRouter.post('/users/logout', authenticate, authenticate, controller.logout);

export default authRouter;
