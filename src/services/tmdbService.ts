import axios, { AxiosInstance } from 'axios';
import { Movie } from '../models/movie';
import { Genre } from '../models/genre';
import sequelize from '../config/database';

export class TMDBService {
  private api: AxiosInstance;
  private baseURL: string = 'https://api.themoviedb.org/3';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      params: {
        api_key: process.env.TMDB_API_KEY,
      },
    });
  }

  async syncGenres(): Promise<void> {
    try {
      const response = await this.api.get('/genre/movie/list');
      const genres = response.data.genres;

      await Genre.bulkCreate(
        genres.map((genre: { id: number; name: string }) => ({
          tmdbId: genre.id,
          name: genre.name,
        })),
        {
          updateOnDuplicate: ['name'],
        }
      );
    } catch (error) {
      console.error('Error syncing genres:', error);
      throw error;
    }
  }

  private filterMovieGenres(genres: Genre[], genreIds: number[]): Genre[] {
    return genres.filter(({ tmdbId }) => genreIds.includes(tmdbId));
  }

  async syncMovies(pages: number = 5): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const genres = await Genre.findAll();
      for (let page = 1; page <= pages; page++) {
        const response = await this.api.get('/movie/popular', {
          params: { page },
        });

        const movies = response.data.results;

        for (const movieData of movies) {
          const [movie] = await Movie.upsert(
            {
              tmdbId: movieData.id,
              title: movieData.title,
              overview: movieData.overview,
              posterPath: movieData.poster_path,
              releaseDate: movieData.release_date,
            },
            { transaction }
          );

          const movieGenres = this.filterMovieGenres(
            genres,
            movieData.genre_ids
          );

          await movie.$set('genres', movieGenres, { transaction });
        }

        console.log(`Successfully synced page ${page} of movies.`);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error syncing movies:', error);
      throw error;
    }
  }

  async getMovieDetails(tmdbId: number): Promise<any> {
    try {
      const response = await this.api.get(`/movie/${tmdbId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${tmdbId}:`, error);
      throw error;
    }
  }

  async searchMovies(
    query: string,
    page: number = 1
  ): Promise<{
    results: Movie[];
    total_results: number;
    total_pages: number;
    page: number;
  }> {
    try {
      const response = await this.api.get('/search/movie', {
        params: {
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
}
