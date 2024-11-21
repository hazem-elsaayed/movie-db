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
