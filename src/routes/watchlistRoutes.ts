import { Router } from 'express';
import { WatchlistController } from '../controllers/watchlistController.js';
import { WatchlistService } from '../services/watchlistService.js';
import { addToWatchlistValidator, removeFromWatchlistValidator } from '../validators/watchlistValidator.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();
const watchlistService = new WatchlistService();
const watchlistController = new WatchlistController(watchlistService);

/**
 * @swagger
 * /api/watchlist/add:
 *   post:
 *     summary: Add a movie to the watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: The ID of the movie to add
 *     responses:
 *       201:
 *         description: Movie added to watchlist
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/add',
  authenticate,
  addToWatchlistValidator,
  validate,
  watchlistController.addToWatchlist
);

/**
 * @swagger
 * /api/watchlist/remove:
 *   delete:
 *     summary: Remove a movie from the watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: The ID of the movie to remove
 *     responses:
 *       200:
 *         description: Movie removed from watchlist
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Movie not found in watchlist
 */
router.delete(
  '/remove',
  authenticate,
  removeFromWatchlistValidator,
  validate,
  watchlistController.removeFromWatchlist
);

/**
 * @swagger
 * /api/watchlist:
 *   get:
 *     summary: Get the watchlist of the authenticated user
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies in the watchlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticate,
  watchlistController.getWatchlist
);

export default router;