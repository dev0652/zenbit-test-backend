import express from 'express';
import { propertiesController as controller } from '../../controllers/index.js';
import { validateBody } from '../../decorators/index.js';
import { propertiesSchemas as schemas } from '../../schemas/index.js';
import {
  authenticate,
  isBodyEmpty,
  isValidId,
  // upload,
} from '../../middleware/index.js';

// ####################################################

const propertiesRouter = express.Router();

propertiesRouter.use(authenticate); // middleware to be executed for all routes

propertiesRouter.get('/', controller.getAll);

propertiesRouter.get('/:id', isValidId, controller.getById);

propertiesRouter.post(
  '/',
  // upload.single('photo'),
  isBodyEmpty,
  validateBody(schemas.propertiesAddSchema),
  controller.add
);

propertiesRouter.delete('/:id', controller.deleteById);

propertiesRouter.put(
  '/:id',
  isValidId,
  isBodyEmpty,
  validateBody(schemas.propertiesAddSchema),
  controller.updateById
);

propertiesRouter.patch(
  '/:id/favorite',
  isValidId,
  isBodyEmpty,
  validateBody(schemas.propertiesToggleFavoriteSchema),
  controller.updateStatusProperty
);

export default propertiesRouter;
