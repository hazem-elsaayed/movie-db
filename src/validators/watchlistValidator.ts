
import { check } from 'express-validator';

export const addToWatchlistValidator = [
  check('movieId').isInt({ min: 1 }).withMessage('Movie ID must be a positive integer'),
];

export const removeFromWatchlistValidator = [
  check('movieId').isInt({ min: 1 }).withMessage('Movie ID must be a positive integer'),
];