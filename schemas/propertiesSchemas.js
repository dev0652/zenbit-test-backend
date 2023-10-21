import Joi from 'joi';

// ####################################################

const propertiesAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).required().messages({
    'any.required': '"Phone" is a required field',
  }),
  favorite: Joi.boolean(),
});

const propertiesToggleFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export default { propertiesAddSchema, propertiesToggleFavoriteSchema };
