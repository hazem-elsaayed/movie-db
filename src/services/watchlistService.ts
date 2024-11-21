import { Genre } from '../models/genre';
import { Movie } from '../models/movie';
import { Watchlist } from '../models/watchlist';
import { CustomError } from '../utils/customError';

export class WatchlistService {
  public async addMovieToWatchlist(
    userId: number,
    movieId: number
  ): Promise<void> {
    try {
      const existingEntry = await Watchlist.findOne({
        where: { userId, movieId },
      });
      if (existingEntry) {
        throw new CustomError('Movie already in watchlist', 400);
      }
      await Watchlist.create({ userId, movieId });
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      throw new CustomError('Failed to add movie to watchlist', 500);
    }
  }

  public async removeMovieFromWatchlist(
    userId: number,
    movieId: number
  ): Promise<void> {
    try {
      const entry = await Watchlist.findOne({ where: { userId, movieId } });
      if (!entry) {
        throw new CustomError('Movie not found in watchlist', 404);
      }
      await entry.destroy();
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
      throw new CustomError('Failed to remove movie from watchlist', 500);
    }
  }

  public async getWatchlist(userId: number): Promise<Watchlist[]> {
    try {
      return await Watchlist.findAll({
        where: { userId },
        include: [
          {
            model: Movie,
            attributes: [
              'title',
              'overview',
              'posterPath',
              'releaseDate',
              'averageRating',
              'ratingCount',
            ],
            include: [
              {
                model: Genre,
                attributes: ['name'],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error retrieving watchlist:', error);
      throw new CustomError('Failed to retrieve watchlist', 500);
    }
  }
}
