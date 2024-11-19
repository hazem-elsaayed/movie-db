import { Sequelize } from 'sequelize-typescript';
import { Movie } from '../models/movie';
import { User } from '../models/user';
import { Rating } from '../models/rating';
import { Watchlist } from '../models/watchlist';
import { Genre } from '../models/genre';
import { MovieGenre } from '../models/movieGenre';
import * as dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  dialect: 'postgres',
  models: [Movie, User, Rating, Watchlist, Genre, MovieGenre],
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
});

export default sequelize;