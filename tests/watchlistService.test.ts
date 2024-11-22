import { WatchlistService } from '../src/services/watchlistService.js';
import { CustomError } from '../src/utils/customError.js';

describe('WatchlistService', () => {
  const mockWatchlistRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn()
  };
  let watchlistService: WatchlistService;

  beforeEach(() => {
    watchlistService = new WatchlistService(mockWatchlistRepository);
    jest.clearAllMocks();
  });

  describe('addMovieToWatchlist', () => {
    it('should add a movie to the watchlist', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue(null);
      mockWatchlistRepository.create.mockResolvedValue({});

      await watchlistService.addMovieToWatchlist(1, 1);

      expect(mockWatchlistRepository.findOne).toHaveBeenCalledWith(1, 1);
      expect(mockWatchlistRepository.create).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error if the movie is already in the watchlist', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue({});

      await expect(watchlistService.addMovieToWatchlist(1, 1)).rejects.toThrow(CustomError);
    });
  });

  describe('removeMovieFromWatchlist', () => {
    it('should remove a movie from the watchlist', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue({});

      await watchlistService.removeMovieFromWatchlist(1, 1);

      expect(mockWatchlistRepository.findOne).toHaveBeenCalledWith(1, 1);
      expect(mockWatchlistRepository.delete).toHaveBeenCalledWith({});
    });

    it('should throw an error if the movie is not found in the watchlist', async () => {
      mockWatchlistRepository.findOne.mockResolvedValue(null);

      await expect(watchlistService.removeMovieFromWatchlist(1, 1)).rejects.toThrow(CustomError);
    });
  });

  describe('getWatchlist', () => {
    it('should return the watchlist for a user', async () => {
      const mockWatchlist = [{ movie: { title: 'Movie 1' } }];
      mockWatchlistRepository.findAll.mockResolvedValue(mockWatchlist);

      const result = await watchlistService.getWatchlist(1);

      expect(mockWatchlistRepository.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWatchlist);
    });
  });
});