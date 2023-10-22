import express from 'express';
import { validateBody } from '../../decorators/index.js';
import { usersSchemas as schemas } from '../../schemas/index.js';
import { authController as controller } from '../../controllers/index.js';
import { authenticate } from '../../middleware/index.js';

// ####################################################

const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateBody(schemas.registerSchema),
  controller.register
);

authRouter.get('/verify/:verificationToken', controller.verify);

authRouter.post('/login', validateBody(schemas.loginSchema), controller.login);

authRouter.get('/current', authenticate, authenticate, controller.getCurrent);

authRouter.post('/logout', authenticate, authenticate, controller.logout);

export default authRouter;
