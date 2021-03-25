import Joi from 'joi';

// User validation rules
export const createUserValidation = {
  body: {
    fullname: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required()
  }
}

export const updateMeValidation = {
  body: {
    phoneNumber: Joi.string(),
    birthdate: Joi.string(),
    mailingAddress: Joi.object()
  }
}
