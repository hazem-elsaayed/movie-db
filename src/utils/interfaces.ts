import { Request } from 'express';

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
