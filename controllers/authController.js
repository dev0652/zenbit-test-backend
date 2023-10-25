import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import { controllerWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';

// ####################################################

const { JWT_SECRET } = process.env;

// ********************************************************

// Error messages:
const emailErrorMsg = 'This email is already linked to an existing account';
const authErrorMsg = 'Invalid email or password';

// ********************************************************

// Register
const register = async (req, res) => {
  const { email, password } = req.body;

  // Check if a user with this email already exists:
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, emailErrorMsg);

  const hashedPass = await bcrypt.hash(password, 10);

  const credentials = { ...req.body, password: hashedPass };

  const newUser = await User.create(credentials);

  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '23h' });

  res
    .status(201)
    .json({ token, user: { name: newUser.name, email: newUser.email } });
};

// ********************************************************

// Log in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw HttpError(401, authErrorMsg);

  const isPasswordValid = await bcrypt.compare(password, user.password); // As of bcryptjs 2.4.0, 'compare' returns a promise if callback (passed as the third argument) is omitted
  if (!isPasswordValid) throw HttpError(401);

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '23h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { name: user.name, email: user.email } });
};

// ********************************************************

// Log out
const logout = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw HttpError(404, 'User not found');

  await User.findByIdAndUpdate(user._id, { token: '' });

  res.json({ message: 'Signed out successfully' });
};

// ********************************************************

// Check if user is logged in
const getCurrent = (req, res) => {
  const { name, email } = req.user;

  res.json({ user: { name, email } });
};

// ********************************************************

export default {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
};
