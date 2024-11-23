import { Request } from 'express';
import { Rating } from '../models/rating.js';
import { Movie } from '../models/movie.js';
import { Watchlist } from '../models/watchlist.js';
import { User } from '../models/user.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface MovieQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  genre?: string;
  title?: string;
}

export interface IUser {
  id: number;
  email: string;
  username: string;
  password: string;
}

export interface IMovie {
  id: number;
  title: string;
  tmdbId: number;
  overview: string;
  posterPath: string;
  releaseDate: Date;
  averageRating: number;
  ratingCount: number;
}

export interface IRatingRepository {
  findOne(userId: number, movieId: number): Promise<Rating | null>;
  create(userId: number, movieId: number, rating: number): Promise<Rating>;
  update(rating: Rating, newValue: number): Promise<Rating>;
  findAllByMovieId(movieId: number): Promise<Rating[]>;
  findAllWithUser(movieId: number): Promise<Rating[]>;
}

export interface IMovieRepository {
  findMovies(query: MovieQuery): Promise<{ rows: Movie[]; count: number }>;
  findById(id: string): Promise<Movie | null>;
  search(query: string): Promise<Movie[]>;
  updateRating(movieId: number, averageRating: number, ratingCount: number): Promise<void>;
}

export interface IWatchlistRepository {
  findOne(userId: number, movieId: number): Promise<Watchlist | null>;
  create(userId: number, movieId: number): Promise<Watchlist>;
  delete(entry: Watchlist): Promise<void>;
  findAll(userId: number): Promise<Watchlist[]>;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(
    email: string,
    hashedPassword: string,
    username: string
  ): Promise<User>;
}

export interface ICache {
  get(key: string): Promise<any>;
  set(key: string, value: any, expiresIn?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPattern(pattern: string): Promise<void>;
}

export interface IAuthService {
  register(email: string, password: string, username: string): Promise<Omit<IUser, 'password'>>;
  login(email: string, password: string): Promise<{ user: Omit<IUser, 'password'>; token: string }>;
}

export interface GetMoviesResult {
  page: number;
  pageSize: number;
  totalElements: number;
  movies: Movie[];
}

export interface IMovieService {
  getMovies(query: MovieQuery): Promise<GetMoviesResult>;
  getMovieById(id: string): Promise<Movie>;
  searchMovies(query: { q: string }): Promise<Movie[]>;
  rateMovie(userId: number, movieId: number, ratingValue: number): Promise<void>;
  getMovieRatings(movieId: number): Promise<Rating[]>;
  updateMovieRating(movieId: number): Promise<void>;
}

export interface IWatchlistService {
  addMovieToWatchlist(userId: number, movieId: number): Promise<void>;
  removeMovieFromWatchlist(userId: number, movieId: number): Promise<void>;
  getWatchlist(userId: number): Promise<Watchlist[]>;
}
