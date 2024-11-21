
import { check } from 'express-validator';

export const rateMovieValidator = [
  check('rating').isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
];