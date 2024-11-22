import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, IMovieService } from '../utils/interfaces.js';

export class MovieController {
  constructor(private movieService: IMovieService) {}

  public getMovies = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const movies = await this.movieService.getMovies(req.query);
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  };

  public getMovieById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const movie = await this.movieService.getMovieById(req.params.id);
      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  };

  public searchMovies = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const movies = await this.movieService.searchMovies(
        req.query as { q: string }
      );
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  };

  public rateMovie = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { rating } = req.body;
      const { id } = req.params;
      await this.movieService.rateMovie(req.user.id, Number(id), rating);
      res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getMovieRatings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const ratings = await this.movieService.getMovieRatings(Number(id));
      res.status(200).json(ratings);
    } catch (error) {
      next(error);
    }
  };
}
