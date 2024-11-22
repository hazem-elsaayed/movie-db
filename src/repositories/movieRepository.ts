import { Op } from 'sequelize';
import { Movie } from '../models/movie.js';
import { Genre } from '../models/genre.js';
import { IMovieRepository, MovieQuery } from '../utils/interfaces.js';

export class MovieRepository implements IMovieRepository {
  async findMovies(query: MovieQuery) {
    const {
      page = 1,
      limit = 10,
      sort = 'title',
      order = 'ASC',
      genre,
      title,
    } = query;
    const offset = (page - 1) * limit;

    const whereClause: { title?: string } = {};
    if (title) {
      whereClause.title = title;
    }

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

  async findById(id: string): Promise<Movie | null> {
    return await Movie.findByPk(id, {
      include: [
        { model: Genre, attributes: ['name'], through: { attributes: [] } },
      ],
    });
  }

  async search(query: string): Promise<Movie[]> {
    return await Movie.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { overview: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: [
        { model: Genre, attributes: ['name'], through: { attributes: [] } },
      ],
    });
  }

  async updateRating(
    movieId: number,
    averageRating: number,
    ratingCount: number
  ): Promise<void> {
    const movie = await Movie.findByPk(movieId);
    if (movie) {
      movie.averageRating = averageRating;
      movie.ratingCount = ratingCount;
      await movie.save();
    }
  }
}
