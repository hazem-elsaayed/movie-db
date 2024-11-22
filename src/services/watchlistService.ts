import { CustomError } from '../utils/customError.js';
import {
  IWatchlistRepository,
  IWatchlistService,
} from '../utils/interfaces.js';

export class WatchlistService implements IWatchlistService {
  constructor(private watchlistRepository: IWatchlistRepository) {}

  public async addMovieToWatchlist(
    userId: number,
    movieId: number
  ): Promise<void> {
    try {
      const existingEntry = await this.watchlistRepository.findOne(
        userId,
        movieId
      );
      if (existingEntry) {
        throw new CustomError('Movie already in watchlist', 400);
      }
      await this.watchlistRepository.create(userId, movieId);
    } catch (error) {
      // console.error('Error adding movie to watchlist:', error);
      throw new CustomError('Failed to add movie to watchlist', 500);
    }
  }

  public async removeMovieFromWatchlist(
    userId: number,
    movieId: number
  ): Promise<void> {
    try {
      const entry = await this.watchlistRepository.findOne(userId, movieId);
      if (!entry) {
        throw new CustomError('Movie not found in watchlist', 404);
      }
      await this.watchlistRepository.delete(entry);
    } catch (error) {
      // console.error('Error removing movie from watchlist:', error);
      throw new CustomError('Failed to remove movie from watchlist', 500);
    }
  }

  public async getWatchlist(userId: number) {
    try {
      return await this.watchlistRepository.findAll(userId);
    } catch (error) {
      // console.error('Error retrieving watchlist:', error);
      throw new CustomError('Failed to retrieve watchlist', 500);
    }
  }
}
