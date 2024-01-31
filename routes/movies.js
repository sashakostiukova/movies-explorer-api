const movieRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { movieIdSchema, movieSchema } = require('../utils/validationSchemas');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', celebrate({ body: movieSchema }), createMovie);
movieRouter.delete('/:_id', celebrate({ params: movieIdSchema }), deleteMovie);

module.exports = { movieRouter };
