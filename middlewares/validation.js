const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

//  email validation
const isEmail = (value, helpers) => {
  if (!validator.isEmail(value)) {
    return helpers.message("Invalid email format");
  }
  return value;
};

//  URL validation
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// creating a clothing item
const createItemValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().required().valid("hot", "cold", "warm").messages({
      "any.only": 'The "weather" field must be one of [hot, cold, warm]',
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

// creating a user
const userValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().custom(isEmail).messages({
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

//  user login
const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom(isEmail).messages({
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// validating user and clothing item IDs
const idValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.length":
        'The "id" field must be a valid 24-character hexadecimal value',
      "string.hex": 'The "id" field must be a valid hexadecimal value',
      "string.empty": 'The "id" field must be filled in',
    }),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    avatar: Joi.string().uri().required(),
  }),
});

module.exports = {
  createItemValidation,
  userValidation,
  loginValidation,
  idValidation,
  updateUserValidation,
};

// const { celebrate, Joi } = require("celebrate");

// const userValidation = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required(),
//     avatar: Joi.string().uri().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),
// });

// const loginValidation = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),
// });

// const idValidation = celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().hex().length(24).required(),
//   }),
// });

// const updateUserValidation = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required(),
//     avatar: Joi.string().uri().required(),
//   }),
// });

// module.exports = {
//   userValidation,
//   loginValidation,
//   idValidation,
//   updateUserValidation,
// };
