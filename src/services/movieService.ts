import dotenv from 'dotenv';
import { Op } from 'sequelize';

import { Movie } from '../models/movie';
import { Genre } from '../models/genre';
import { CustomError } from '../utils/customError';
import { MovieQuery } from '../utils/interfaces';
import redisCache, { RedisCache } from '../utils/redisCache';

dotenv.config();

export class MovieService {
  private readonly cache: RedisCache;
  private expiresIn = Number(process.env.CACHE_EXPIRY) || 600;

  constructor(cache: RedisCache = redisCache) {
    this.cache = cache;
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
}
