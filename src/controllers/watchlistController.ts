import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, IWatchlistService } from '../utils/interfaces.js';

export class WatchlistController {
  constructor(private readonly watchlistService: IWatchlistService) {}

  public addToWatchlist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { movieId } = req.body;
      await this.watchlistService.addMovieToWatchlist(userId, movieId);
      res.status(201).json({ message: 'Movie added to watchlist' });
    } catch (error) {
      next(error);
    }
  };

  public removeFromWatchlist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const { movieId } = req.body;
      await this.watchlistService.removeMovieFromWatchlist(userId, movieId);
      res.status(200).json({ message: 'Movie removed from watchlist' });
    } catch (error) {
      next(error);
    }
  };

  public getWatchlist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const watchlist = await this.watchlistService.getWatchlist(userId);
      res.status(200).json(watchlist);
    } catch (error) {
      next(error);
    }
  };
}
