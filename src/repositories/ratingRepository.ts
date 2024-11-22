import { Rating } from '../models/rating.js';
import { User } from '../models/user.js';
import { IRatingRepository } from '../utils/interfaces.js';

export class RatingRepository implements IRatingRepository {
  async findOne(userId: number, movieId: number): Promise<Rating | null> {
    return await Rating.findOne({ where: { userId, movieId } });
  }

  async create(
    userId: number,
    movieId: number,
    rating: number
  ): Promise<Rating> {
    return await Rating.create({ userId, movieId, rating });
  }

  async update(rating: Rating, newValue: number): Promise<Rating> {
    rating.rating = newValue;
    return await rating.save();
  }

  async findAllByMovieId(movieId: number): Promise<Rating[]> {
    return await Rating.findAll({ where: { movieId } });
  }

  async findAllWithUser(movieId: number): Promise<Rating[]> {
    return await Rating.findAll({
      where: { movieId },
      include: [{ model: User, attributes: ['username'] }],
    });
  }
}
