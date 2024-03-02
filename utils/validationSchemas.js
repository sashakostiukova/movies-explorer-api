const { Joi } = require('celebrate');

const userSignInSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

const userSignUpSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  name: Joi.string().required().min(2).max(30),
});

const movieIdSchema = Joi.object().keys({
  _id: Joi.string().required().hex(),
});

const userUpdateSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  name: Joi.string().required().min(2).max(30),
});

const movieSchema = Joi.object().keys({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  trailerLink: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  thumbnail: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required().min(2),
  nameEN: Joi.string().required().min(2),
});

module.exports = {
  userSignInSchema,
  userSignUpSchema,
  movieIdSchema,
  userUpdateSchema,
  movieSchema,
};
