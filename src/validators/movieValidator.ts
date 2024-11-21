
import { check } from 'express-validator';

export const getMoviesValidator = [
  check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  check('sort').optional().isString().withMessage('Sort must be a string'),
  check('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be either ASC or DESC'),
  check('genre').optional().isString().withMessage('Genre must be a string'),
  check('title').optional().isString().withMessage('Title must be a string'),
];

export const getMovieByIdValidator = [
  check('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

export const searchMoviesValidator = [
  check('q').isString().withMessage('query paramerter q must be a string'),
];

export const getMoviesByGenreValidator = [
  check('genre').isString().withMessage('Genre must be a string'),
];