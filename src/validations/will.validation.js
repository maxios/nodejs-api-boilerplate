import Joi from 'joi';

// Will validation rules
export const createWillValidation = {
  body: {
    step: Joi.string().required(),
    data: Joi.object().required()
  }
}

