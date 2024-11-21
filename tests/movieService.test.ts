
import { MovieService } from '../src/services/movieService';
import { Movie } from '../src/models/movie';
import { Genre } from '../src/models/genre';
import { RedisCache } from '../src/utils/redisCache';
import { CustomError } from '../src/utils/customError';

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
});