import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import User from '../models/user.js';
import { controllerWrapper } from '../decorators/index.js';
import { HttpError } from '../helpers/index.js';
import { sendEmail } from '../services/index.js';

// ####################################################

const { BASE_URL, JWT_SECRET } = process.env;

// ********************************************************

// Error messages:
const emailErrorMsg = 'This email is already linked to an existing account';
const authErrorMsg = 'Invalid email or password';
const verifyEmailMsg = 'You need to verify your email first';

const makeVerificationEmail = (email, verificationToken) => ({
  to: email,
  subject: 'Verify your email',
  html: `Please follow <a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">this link</a> to verify your email.`,
});

// ********************************************************

// Register / sign up
const register = async (req, res) => {
  const { email, password } = req.body;

  // Check if a user with this email already exists:
  const user = await User.findOne({ email });
  if (user) throw HttpError(409, emailErrorMsg);

  const hashedPass = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const credentials = {
    ...req.body,
    password: hashedPass,
    verificationToken,
  };
  const newUser = await User.create(credentials);

  const verificationEmail = makeVerificationEmail(email, verificationToken);
  sendEmail(verificationEmail);

  res.status(201).json({
    ...(newUser.name && { name: newUser.name }),
    email: newUser.email,
  });
};

// ********************************************************

// Verify user email
const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) throw HttpError(404, 'User not found');

  const id = user._id;

  await User.findByIdAndUpdate(id, {
    verify: true,
    verificationToken: '',
  });

  res.json({ message: 'Verification successful' });
};

// ********************************************************

// Log in
const login = async (req, res) => {
  const { email: reqEmail, password: reqPass } = req.body;

  const user = await User.findOne({ email: reqEmail });
  if (!user) throw HttpError(401, authErrorMsg);
  if (!user.verify) throw HttpError(401, verifyEmailMsg);

  const { email, password, id } = user;

  const isPasswordValid = await bcrypt.compare(reqPass, password); // As of bcryptjs 2.4.0, 'compare' returns a promise if callback (passed as the third argument) is omitted
  if (!isPasswordValid) throw HttpError(401);

  const payload = { id };
  const secret = JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: '23h' });

  await User.findByIdAndUpdate(id, { token });

  res.json({ token, user: { name: user.name, email } });
};

// ********************************************************

// Log out
const logout = async (req, res) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: '' });

  res.json({ message: 'Signed out successfully' });
};

// ********************************************************

// Check if user is logged in
const getCurrent = (req, res) => {
  const { email } = req.user;

  res.json({ email });
};

// ********************************************************

export default {
  register: controllerWrapper(register),
  verify: controllerWrapper(verify),
  login: controllerWrapper(login),
  logout: controllerWrapper(logout),
  getCurrent: controllerWrapper(getCurrent),
};
