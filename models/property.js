import { Schema, model } from 'mongoose';
import { handleSaveError, handleUpdateValidate } from './hooks.js';

// ######################################

const propertySchema = new Schema(
  {
    propertyName: {
      type: String,
    },
    price: {
      type: Number,
    },
    ticketPrice: {
      type: Number,
    },
    yield: {
      type: Number,
    },
    daysLeft: {
      type: Number,
    },
    sold: {
      type: Number,
    },
    imageLink: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

propertySchema.pre('findOneAndUpdate', handleUpdateValidate);

// Fired only if schema validation fails:
propertySchema.post('save', handleSaveError);
propertySchema.post('findOneAndUpdate', handleSaveError);

const Property = model('property', propertySchema);

export default Property;
