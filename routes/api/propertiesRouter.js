import express from 'express';
import { propertiesController as controller } from '../../controllers/index.js';
import { validateBody } from '../../decorators/index.js';
import { propertiesSchemas as schemas } from '../../schemas/index.js';
import {
  authenticate,
  isBodyEmpty,
  isValidId,
} from '../../middleware/index.js';

// ####################################################

const propertiesRouter = express.Router();

propertiesRouter.use(authenticate); // middleware to be executed for all routes

propertiesRouter.get('/', controller.getAll);

propertiesRouter.get('/:id', isValidId, controller.getById);

export default propertiesRouter;
