import { Genre } from '../models/genre.js';
import { Movie } from '../models/movie.js';
import { Watchlist } from '../models/watchlist.js';
import { IWatchlistRepository } from '../utils/interfaces.js';

export class WatchlistRepository implements IWatchlistRepository {
  public async findOne(
    userId: number,
    movieId: number
  ): Promise<Watchlist | null> {
    return await Watchlist.findOne({
      where: { userId, movieId },
    });
  }

  public async create(userId: number, movieId: number): Promise<Watchlist> {
    return await Watchlist.create({ userId, movieId });
  }

  public async delete(entry: Watchlist): Promise<void> {
    await entry.destroy();
  }

  public async findAll(userId: number): Promise<Watchlist[]> {
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
  }
}
