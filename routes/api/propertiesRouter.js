import express from 'express';
import { propertiesController as controller } from '../../controllers/index.js';

// ####################################################

const propertiesRouter = express.Router();

propertiesRouter.get('/fetch', controller.getProperties);

export default propertiesRouter;
