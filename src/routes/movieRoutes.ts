import { Router } from 'express';
import { MovieController } from '../controllers/movieController';
import { MovieService } from '../services/movieService';
import {
  getMoviesValidator,
  getMovieByIdValidator,
  searchMoviesValidator,
} from '../validators/movieValidator';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/authMiddleware';
import { rateMovieValidator } from '../validators/ratingValidator';

const router = Router();
const movieService = new MovieService();
const movieController = new MovieController(movieService);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get a list of movies
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of movies per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Genre to filter by
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to filter with
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 totalElements:
 *                   type: integer
 *                 movies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 */
router.get(
  '/',
  authenticate,
  getMoviesValidator,
  validate,
  movieController.getMovies
);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search for movies title and description
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: keyword to search for in title and description
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get(
  '/search',
  authenticate,
  searchMoviesValidator,
  validate,
  movieController.searchMovies
);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */
router.get(
  '/:id',
  authenticate,
  getMovieByIdValidator,
  validate,
  movieController.getMovieById
);

/**
 * @swagger
 * /api/movies/{id}/rate:
 *   post:
 *     summary: Rate a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 */
router.post(
  '/:id/rate',
  authenticate,
  rateMovieValidator,
  validate,
  movieController.rateMovie
);

/**
 * @swagger
 * /api/movies/{id}/ratings:
 *   get:
 *     summary: Get ratings for a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: A list of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/rating'
 */
router.get(
  '/:id/ratings',
  authenticate,
  movieController.getMovieRatings
);

export default router;
