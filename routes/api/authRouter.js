import express from 'express';
import { validateBody } from '../../decorators/index.js';
import { authSchemas as schemas } from '../../schemas/index.js';
import { authController as controller } from '../../controllers/index.js';
import { authenticate } from '../../middleware/index.js';

// ####################################################

const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateBody(schemas.registerSchema),
  controller.register
);

authRouter.post('/login', validateBody(schemas.loginSchema), controller.login);

authRouter.post('/logout', authenticate, authenticate, controller.logout);

export default authRouter;
