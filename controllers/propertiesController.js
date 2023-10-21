import Property from '../models/property.js';
import { controllerWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';

// ####################################################

const notFoundMsg = 'Could not find property with the requested id';

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...q } = req.query;
  const skip = (page - 1) * limit;

  const result = await Property.find({ owner, ...q }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'name, email');

  res.json(result);
};

const getById = async ({ params: { id } }, res) => {
  const result = await Property.findById(id);
  if (!result) throw HttpError(404, notFoundMsg);

  res.json(result);
};

// ####################################################

export default {
  getAll: controllerWrapper(getAll),
  getById: controllerWrapper(getById),
};
