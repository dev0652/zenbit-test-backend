import Property from '../models/property.js';
import { controllerWrapper } from '../decorators/index.js';

const getProperties = async (req, res) => {
  const result = await Property.find();
  res.json(result);
};

export default {
  getProperties: controllerWrapper(getProperties),
};
