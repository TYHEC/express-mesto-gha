const { celebrate, Joi } = require('celebrate');

const regular = /^(https?:\/\/)?([\w-]{1,16}\.[\w-]{1,16})[^\s@]*$/m;

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regular),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
const updateInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});
const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regular),
  }),
});
const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});
const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(regular),
  }),
});
const updateCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  updateCardValidation,
  createCardValidation,
  userIdValidation,
  updateAvatarValidation,
  updateInfoValidation,
  createUserValidation,
  loginValidation,
  regular,
};
