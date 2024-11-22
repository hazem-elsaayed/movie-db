import dotenv from 'dotenv';

import { Movie } from '../models/movie.js';
import { CustomError } from '../utils/customError.js';
import {
  ICache,
  IMovieRepository,
  IMovieService,
  IRatingRepository,
  MovieQuery,
} from '../utils/interfaces.js';
import { Rating } from '../models/rating.js';

dotenv.config();

export class MovieService implements IMovieService {
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly ratingRepository: IRatingRepository,
    private readonly cache: ICache,
    private readonly expiresIn: number = 600
  ) {}

  public async getMovies(query: MovieQuery) {
    const cacheKey = this.generateCacheKey(query);
    const cachedMovies = await this.cache.get(cacheKey);
    if (cachedMovies) {
      return cachedMovies;
    }

    const { rows: movies, count: totalElements } =
      await this.movieRepository.findMovies(query);

    const result = {
      page: Number(query.page || 1),
      pageSize: Number(query.limit || 10),
      totalElements,
      movies,
    };

    await this.cache.set(cacheKey, result, this.expiresIn);
    return result;
  }

  public async getMovieById(id: string): Promise<Movie> {
    const cacheKey = `movie_${id}`;
    const cachedMovie = await this.cache.get(cacheKey);
    if (cachedMovie) {
      return cachedMovie;
    }

    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new CustomError('Movie not found', 404);
    }

    await this.cache.set(cacheKey, movie, this.expiresIn);
    return movie;
  }

  public async searchMovies(query: { q: string }): Promise<Movie[]> {
    const { q } = query;

    const cacheKey = `search_${q}`;
    const cachedMovies = await this.cache.get(cacheKey);
    if (cachedMovies) {
      return cachedMovies;
    }

    const movies = await this.movieRepository.search(q);

    await this.cache.set(cacheKey, movies, this.expiresIn);
    return movies;
  }

  public async rateMovie(
    userId: number,
    movieId: number,
    ratingValue: number
  ) {
    const existingRating = await this.ratingRepository.findOne(
      userId,
      movieId
    );

    if (existingRating) {
      await this.ratingRepository.update(existingRating, ratingValue);
    } else {
      await this.ratingRepository.create(userId, movieId, ratingValue);
    }

    await this.updateMovieRating(movieId);
  }

  public async getMovieRatings(movieId: number) {
    return await this.ratingRepository.findAllWithUser(movieId);
  }

  public async updateMovieRating(movieId: number) {
    const ratings = await this.ratingRepository.findAllByMovieId(movieId);

    const { averageRating, ratingCount } =
      this.calculateAverageRating(ratings);

    await this.movieRepository.updateRating(
      movieId,
      averageRating,
      ratingCount
    );
  }

  private calculateAverageRating(ratings: Rating[]) {
    const ratingCount = ratings.length;
    const averageRating =
      ratingCount > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratingCount
        : 0;

    return { averageRating, ratingCount };
  }

  private generateCacheKey(query: MovieQuery): string {
    const {
      page = 1,
      limit = 10,
      sort = 'title',
      order = 'ASC',
      genre,
      title,
    } = query;
    return `movies_${page}_${limit}_${sort}_${order}_${genre}_${title}`;
  }
}
