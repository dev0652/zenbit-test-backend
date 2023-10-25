import { Schema, model } from 'mongoose';
import { handleSaveError, handleUpdateValidate } from './hooks.js';
import emailRegexp from '../constants/user-constants.js';

// ##############################################

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is a required field'],
    },
    email: {
      type: String,
      set: (value) => value.toLowerCase(),
      required: [true, 'Email is a required field'],
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Password is a required field'],
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre('findOneAndUpdate', handleUpdateValidate);

// Fired only if schema validation fails:
userSchema.post('save', handleSaveError);
userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;
