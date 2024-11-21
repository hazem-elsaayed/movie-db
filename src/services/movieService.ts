import dotenv from 'dotenv';
import { Op } from 'sequelize';

import { Movie } from '../models/movie';
import { Genre } from '../models/genre';
import { CustomError } from '../utils/customError';
import { MovieQuery } from '../utils/interfaces';
import redisCache, { RedisCache } from '../utils/redisCache';
import { Rating } from '../models/rating';
import { User } from '../models/user';

dotenv.config();

export class MovieService {
  private expiresIn = Number(process.env.CACHE_EXPIRY) || 600;

  constructor(private readonly cache: RedisCache = redisCache) {

  }

  public async getMovies(query: MovieQuery) {
    const {
      page = 1,
      limit = 10,
      sort = 'title',
      order = 'ASC',
      genre,
      title,
    } = query;
    const offset = (page - 1) * limit;

    const cacheKey = this.generateCacheKey(
      page,
      limit,
      sort,
      order,
      genre,
      title
    );
    const cachedMovies = await this.cache.get(cacheKey);
    if (cachedMovies) {
      return cachedMovies;
    }

    const whereClause = this.buildWhereClause(title);
    const { rows: movies, count: totalElements } = await this.fetchMovies(
      whereClause,
      genre,
      offset,
      limit,
      sort,
      order
    );

    const result = {
      page: Number(page),
      pageSize: Number(limit),
      totalElements,
      movies,
    };

    await this.cache.set(cacheKey, result, this.expiresIn);
    return result;
  }

  private generateCacheKey(
    page: number,
    limit: number,
    sort: string,
    order: string,
    genre?: string,
    title?: string
  ): string {
    return `movies_${page}_${limit}_${sort}_${order}_${genre}_${title}`;
  }

  private buildWhereClause(title?: string): { title?: string } {
    const whereClause: { title?: string } = {};
    if (title) {
      whereClause.title = title;
    }
    return whereClause;
  }

  private async fetchMovies(
    whereClause: { title?: string },
    genre: string | undefined,
    offset: number,
    limit: number,
    sort: string,
    order: string
  ) {
    return await Movie.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['name'],
          where: genre ? { name: genre } : {},
          through: { attributes: [] },
        },
      ],
      offset: offset,
      limit: Number(limit),
      order: [[sort, order]],
      distinct: true,
    });
  }

  public async getMovieById(id: string): Promise<Movie> {
    const cacheKey = `movie_${id}`;
    const cachedMovie = await this.cache.get(cacheKey);
    if (cachedMovie) {
      return cachedMovie;
    }

    const movie = await Movie.findByPk(id, {
      include: [
        { model: Genre, attributes: ['name'], through: { attributes: [] } },
      ],
    });
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

    const searchConditions = this.buildSearchConditions(q);
    const movies = await Movie.findAll({
      where: searchConditions,
      include: [
        { model: Genre, attributes: ['name'], through: { attributes: [] } },
      ],
    });

    await this.cache.set(cacheKey, movies, this.expiresIn);
    return movies;
  }

  private buildSearchConditions(query: string) {
    return {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { overview: { [Op.iLike]: `%${query}%` } },
      ],
    };
  }

  public async rateMovie(
    userId: number,
    movieId: number,
    ratingValue: number
  ) {
    const existingRating = await Rating.findOne({
      where: { userId, movieId },
    });
    if (existingRating) {
      existingRating.rating = ratingValue;
      await existingRating.save();
    } else {
      await Rating.create({ userId, movieId, rating: ratingValue });
    }

    await this.updateMovieRating(movieId);
  }

  public async getMovieRatings(movieId: number) {
    return await Rating.findAll({
      where: { movieId },
      include: [{ model: User, attributes: ['username'] }],
    });
  }

  public async updateMovieRating(movieId: number) {
    const ratings = await this.getRatingsByMovieId(movieId);
    const { averageRating, ratingCount } = this.calculateAverageRating(ratings);

    await this.updateMovieWithRating(movieId, averageRating, ratingCount);
  }

  private async getRatingsByMovieId(movieId: number) {
    const movie = await Rating.findAll({ where: { movieId } });
    if (!movie) {
      throw new CustomError('Movie not found', 404);
    }
    return movie;
  }

  private calculateAverageRating(ratings: Rating[]) {
    const ratingCount = ratings.length;
    const averageRating =
      ratingCount > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratingCount : 0;

    return { averageRating, ratingCount };
  }

  private async updateMovieWithRating(movieId: number, averageRating: number, ratingCount: number) {
    const movie = await Movie.findByPk(movieId);
    if (movie) {
      movie.averageRating = averageRating;
      movie.ratingCount = ratingCount;
      await movie.save();
    }
  }
}
