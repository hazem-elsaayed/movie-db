
import { WatchlistService } from '../src/services/watchlistService';
import { Watchlist } from '../src/models/watchlist';
import { Movie } from '../src/models/movie';
import { Genre } from '../src/models/genre';
import { CustomError } from '../src/utils/customError';

jest.mock('../src/models/watchlist');
jest.mock('../src/models/movie');
jest.mock('../src/models/genre');

describe('WatchlistService', () => {
  let watchlistService: WatchlistService;

  beforeEach(() => {
    watchlistService = new WatchlistService();
  });

  describe('addMovieToWatchlist', () => {
    it('should add a movie to the watchlist', async () => {
      (Watchlist.findOne as jest.Mock).mockResolvedValue(null);
      (Watchlist.create as jest.Mock).mockResolvedValue({});

      await watchlistService.addMovieToWatchlist(1, 1);

      expect(Watchlist.findOne).toHaveBeenCalledWith({ where: { userId: 1, movieId: 1 } });
      expect(Watchlist.create).toHaveBeenCalledWith({ userId: 1, movieId: 1 });
    });

    it('should throw an error if the movie is already in the watchlist', async () => {
      (Watchlist.findOne as jest.Mock).mockResolvedValue({});

      await expect(watchlistService.addMovieToWatchlist(1, 1)).rejects.toThrow(CustomError);
    });
  });

  describe('removeMovieFromWatchlist', () => {
    it('should remove a movie from the watchlist', async () => {
      const mockEntry = { destroy: jest.fn() };
      (Watchlist.findOne as jest.Mock).mockResolvedValue(mockEntry);

      await watchlistService.removeMovieFromWatchlist(1, 1);

      expect(Watchlist.findOne).toHaveBeenCalledWith({ where: { userId: 1, movieId: 1 } });
      expect(mockEntry.destroy).toHaveBeenCalled();
    });

    it('should throw an error if the movie is not found in the watchlist', async () => {
      (Watchlist.findOne as jest.Mock).mockResolvedValue(null);

      await expect(watchlistService.removeMovieFromWatchlist(1, 1)).rejects.toThrow(CustomError);
    });
  });

  describe('getWatchlist', () => {
    it('should return the watchlist for a user', async () => {
      const mockWatchlist = [
        {
          movie: {
            title: 'Movie 1',
            overview: 'Overview 1',
            posterPath: 'path1.jpg',
            releaseDate: new Date(),
            averageRating: 4.5,
            ratingCount: 10,
            genres: [{ name: 'Genre 1' }],
          },
        },
      ];
      (Watchlist.findAll as jest.Mock).mockResolvedValue(mockWatchlist);

      const result = await watchlistService.getWatchlist(1);

      expect(Watchlist.findAll).toHaveBeenCalledWith({
        where: { userId: 1 },
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
      expect(result).toEqual(mockWatchlist);
    });

    it('should throw an error if there is an issue retrieving the watchlist', async () => {
      (Watchlist.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(watchlistService.getWatchlist(1)).rejects.toThrow(CustomError);
    });
  });
});