// import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { HttpError } from '../helpers/index.js';
import User from '../models/user.js';

import { controllerWrapper } from '../decorators/index.js';

// ####################################################

const secret = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' && !token) {
    throw HttpError(401);
  }

  try {
    const payload = jwt.verify(token, secret);
    console.log('payload: ', payload);
    const { id } = payload;

    const user = await User.findById(id);
    if (!user || !token) throw HttpError(401);

    req.user = user;

    next();
  } catch {
    throw HttpError(401, 'Unauthorized');
  }
};

export default controllerWrapper(authenticate);
