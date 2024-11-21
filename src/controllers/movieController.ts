import { Response, NextFunction } from 'express';
import { MovieService } from '../services/movieService';
import { AuthenticatedRequest } from '../utils/interfaces';

export class MovieController {
  private movieService: MovieService;

  constructor(movieService: MovieService) {
    this.movieService = movieService;
  }

  public getMovies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const movies = await this.movieService.getMovies(req.query);
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  };

  public getMovieById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const movie = await this.movieService.getMovieById(req.params.id);
      res.status(200).json(movie);
    } catch (error) {
      next(error);
    }
  };

  public searchMovies = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const movies = await this.movieService.searchMovies(req.query as { q: string });
      res.status(200).json(movies);
    } catch (error) {
      next(error);
    }
  };
}