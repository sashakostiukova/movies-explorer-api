const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const {
  SUCCESS_CODE_OK,
  SUCCESS_CODE_CREATED,
} = require('../utils/codes');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.send(movies);
  } catch (error) {
    next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const owner = req.user._id;
    const newMovie = await new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });
    return res.status(SUCCESS_CODE_CREATED).send(await newMovie.save());
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка валидации полей'));
    } else {
      next(error);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.find({ movieId: req.params._id });
    console.log(movie); //////////////

    if (!movie) {
      throw new NotFoundError('Карточка по id не найдена');
    }

    const ownerId = movie.owner.toString();
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Нет прав для совершения действия');
    }

    await movie.deleteOne();
    return res.status(SUCCESS_CODE_OK).send(movie);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Передан невалидный id'));
    } else {
      next(error);
    }
  }
};
