import Property from '../models/property.js';
import { controllerWrapper } from '../decorators/index.js';
// import { HttpError } from '../helpers/index.js';

// ####################################################

// const notFoundMsg = 'Could not find property with the requested id';

const getProperties = async (req, res) => {
  const result = await Property.find();
  res.json(result);
};

// const getById = async ({ params: { id } }, res) => {
//   const result = await Property.findById(id);
//   if (!result) throw HttpError(404, notFoundMsg);

//   res.json(result);
// };

// ####################################################

export default {
  getProperties: controllerWrapper(getProperties),
  // getById: controllerWrapper(getById),
};
