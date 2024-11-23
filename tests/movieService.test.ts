import { MovieService } from '../src/services/movieService.js';
import { CustomError } from '../src/utils/customError.js';

describe('MovieService', () => {
  const mockMovieRepository = {
    findMovies: jest.fn(),
    findById: jest.fn(),
    search: jest.fn(),
    updateRating: jest.fn()
  };

  const mockRatingRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAllWithUser: jest.fn(),
    findAllByMovieId: jest.fn()
  };

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn()
  };

  const movieService = new MovieService(mockMovieRepository, mockRatingRepository, mockCache);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return a list of movies from cache', async () => {
      const query = { page: 1, limit: 10 };
      const cachedMovies = { movies: [], page: 1, pageSize: 10, totalElements: 0 };

      mockCache.get.mockResolvedValue(cachedMovies);

      const result = await movieService.getMovies(query);

      expect(mockCache.get).toHaveBeenCalled();
      expect(result).toEqual(cachedMovies);
    });

    it('should return a list of movies from database', async () => {
      const query = { page: 1, limit: 10 };
      const movies = [{ id: 1, title: 'Movie 1' }];
      const count = 1;

      mockCache.get.mockResolvedValue(null);
      mockMovieRepository.findMovies.mockResolvedValue({ rows: movies, count });

      const result = await movieService.getMovies(query);

      expect(mockCache.get).toHaveBeenCalled();
      expect(mockMovieRepository.findMovies).toHaveBeenCalled();
      expect(result).toEqual({ movies, page: 1, pageSize: 10, totalElements: count });
    });
  });

  describe('getMovieById', () => {
    it('should return a movie from cache', async () => {
      const id = '1';
      const cachedMovie = { id: 1, title: 'Movie 1' };

      mockCache.get.mockResolvedValue(cachedMovie);

      const result = await movieService.getMovieById(id);

      expect(mockCache.get).toHaveBeenCalled();
      expect(result).toEqual(cachedMovie);
    });

    it('should return a movie from database', async () => {
      const id = '1';
      const movie = { id: 1, title: 'Movie 1' };

      mockCache.get.mockResolvedValue(null);
      mockMovieRepository.findById.mockResolvedValue(movie);

      const result = await movieService.getMovieById(id);

      expect(mockCache.get).toHaveBeenCalled();
      expect(mockMovieRepository.findById).toHaveBeenCalled();
      expect(result).toEqual(movie);
    });

    it('should throw an error if movie is not found', async () => {
      const id = '1';

      mockCache.get.mockResolvedValue(null);
      mockMovieRepository.findById.mockResolvedValue(null);

      await expect(movieService.getMovieById(id)).rejects.toThrow(CustomError);
      expect(mockCache.get).toHaveBeenCalled();
      expect(mockMovieRepository.findById).toHaveBeenCalled();
    });
  });

  describe('searchMovies', () => {
    it('should return a list of movies from cache', async () => {
      const query = { q: 'test' };
      const cachedMovies = [{ id: 1, title: 'Movie 1' }];

      mockCache.get.mockResolvedValue(cachedMovies);

      const result = await movieService.searchMovies(query);

      expect(mockCache.get).toHaveBeenCalled();
      expect(result).toEqual(cachedMovies);
    });

    it('should return a list of movies from database', async () => {
      const query = { q: 'test' };
      const movies = [{ id: 1, title: 'Movie 1' }];

      mockCache.get.mockResolvedValue(null);
      mockMovieRepository.search.mockResolvedValue(movies);

      const result = await movieService.searchMovies(query);

      expect(mockCache.get).toHaveBeenCalled();
      expect(mockMovieRepository.search).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  it('should create a new rating if it does not exist', async () => {
    mockRatingRepository.findOne.mockResolvedValue(null);
    mockRatingRepository.create.mockResolvedValue({});
    movieService.updateMovieRating = jest.fn();

    await movieService.rateMovie(1, 1, 8);

    expect(mockRatingRepository.findOne).toHaveBeenCalledWith(1, 1);
    expect(mockRatingRepository.create).toHaveBeenCalledWith(1, 1, 8);
    expect(movieService.updateMovieRating).toHaveBeenCalledWith(1);
  });

  it('should update an existing rating', async () => {
    const existingRating = { rating: 5, save: jest.fn() };
    mockRatingRepository.findOne.mockResolvedValue(existingRating);
    movieService.updateMovieRating = jest.fn();

    await movieService.rateMovie(1, 1, 8);

    expect(mockRatingRepository.update).toHaveBeenCalled();
    expect(movieService.updateMovieRating).toHaveBeenCalledWith(1);
  });

  describe('getMovieRatings', () => {
    it('should return all ratings for a movie', async () => {
      const ratings = [{ rating: 8, user: { username: 'user1' } }];
      mockRatingRepository.findAllWithUser.mockResolvedValue(ratings);
  
      const result = await movieService.getMovieRatings(1);
  
      expect(mockRatingRepository.findAllWithUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(ratings);
    });
  });
});
