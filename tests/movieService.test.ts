
import { MovieService } from '../src/services/movieService.js';
import { Movie } from '../src/models/movie.js';
import { Rating } from '../src/models/rating.js';
import { User } from '../src/models/user.js';
import { RedisCache } from '../src/utils/redisCache.js';
import { CustomError } from '../src/utils/customError.js';

jest.mock('../src/models/movie');
jest.mock('../src/models/genre');
jest.mock('../src/utils/redisCache');

describe('MovieService', () => {
  const redisCache = new RedisCache();
  const movieService = new MovieService(redisCache);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return a list of movies from cache', async () => {
      const query = { page: 1, limit: 10 };
      const cachedMovies = { movies: [], page: 1, pageSize: 10, totalElements: 0 };

      (redisCache.get as jest.Mock).mockResolvedValue(cachedMovies);

      const result = await movieService.getMovies(query);

      expect(redisCache.get).toHaveBeenCalled();
      expect(result).toEqual(cachedMovies);
    });

    it('should return a list of movies from database', async () => {
      const query = { page: 1, limit: 10 };
      const movies = [{ id: 1, title: 'Movie 1' }];
      const count = 1;

      (redisCache.get as jest.Mock).mockResolvedValue(null);
      (Movie.findAndCountAll as jest.Mock).mockResolvedValue({ rows: movies, count });

      const result = await movieService.getMovies(query);

      expect(redisCache.get).toHaveBeenCalled();
      expect(Movie.findAndCountAll).toHaveBeenCalled();
      expect(result).toEqual({ movies, page: 1, pageSize: 10, totalElements: count });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie from cache', async () => {
      const id = '1';
      const cachedMovie = { id: 1, title: 'Movie 1' };

      (redisCache.get as jest.Mock).mockResolvedValue(cachedMovie);

      const result = await movieService.getMovieById(id);

      expect(redisCache.get).toHaveBeenCalled();
      expect(result).toEqual(cachedMovie);
    });

    it('should return a movie from database', async () => {
      const id = '1';
      const movie = { id: 1, title: 'Movie 1' };

      (redisCache.get as jest.Mock).mockResolvedValue(null);
      (Movie.findByPk as jest.Mock).mockResolvedValue(movie);

      const result = await movieService.getMovieById(id);

      expect(redisCache.get).toHaveBeenCalled();
      expect(Movie.findByPk).toHaveBeenCalled();
      expect(result).toEqual(movie);
    });

    it('should throw an error if movie is not found', async () => {
      const id = '1';

      (redisCache.get as jest.Mock).mockResolvedValue(null);
      (Movie.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(movieService.getMovieById(id)).rejects.toThrow(CustomError);
      expect(redisCache.get).toHaveBeenCalled();
      expect(Movie.findByPk).toHaveBeenCalled();
    });
  });

  describe('searchMovies', () => {
    it('should return a list of movies from cache', async () => {
      const query = { q: 'test' };
      const cachedMovies = [{ id: 1, title: 'Movie 1' }];

      (redisCache.get as jest.Mock).mockResolvedValue(cachedMovies);

      const result = await movieService.searchMovies(query);

      expect(redisCache.get).toHaveBeenCalled();
      expect(result).toEqual(cachedMovies);
    });

    it('should return a list of movies from database', async () => {
      const query = { q: 'test' };
      const movies = [{ id: 1, title: 'Movie 1' }];

      (redisCache.get as jest.Mock).mockResolvedValue(null);
      (Movie.findAll as jest.Mock).mockResolvedValue(movies);

      const result = await movieService.searchMovies(query);

      expect(redisCache.get).toHaveBeenCalled();
      expect(Movie.findAll).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  it('should create a new rating if it does not exist', async () => {
    Rating.findOne = jest.fn().mockResolvedValue(null);
    Rating.create = jest.fn().mockResolvedValue({});
    movieService.updateMovieRating = jest.fn();

    await movieService.rateMovie(1, 1, 8);

    expect(Rating.findOne).toHaveBeenCalledWith({ where: { userId: 1, movieId: 1 } });
    expect(Rating.create).toHaveBeenCalledWith({ userId: 1, movieId: 1, rating: 8 });
    expect(movieService.updateMovieRating).toHaveBeenCalledWith(1);
  });

  it('should update an existing rating', async () => {
    const existingRating = { rating: 5, save: jest.fn() };
    Rating.findOne = jest.fn().mockResolvedValue(existingRating);
    movieService.updateMovieRating = jest.fn();

    await movieService.rateMovie(1, 1, 8);

    expect(existingRating.rating).toBe(8);
    expect(existingRating.save).toHaveBeenCalled();
    expect(movieService.updateMovieRating).toHaveBeenCalledWith(1);
  });

  describe('getMovieRatings', () => {
    it('should return all ratings for a movie', async () => {
      const ratings = [{ rating: 8, user: { username: 'user1' } }];
      Rating.findAll = jest.fn().mockResolvedValue(ratings);
  
      const result = await movieService.getMovieRatings(1);
  
      expect(Rating.findAll).toHaveBeenCalledWith({
        where: { movieId: 1 },
        include: [{ model: User, attributes: ['username'] }],
      });
      expect(result).toEqual(ratings);
    });
  });
});
