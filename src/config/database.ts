import { Sequelize } from 'sequelize-typescript';
import { Movie, User, Rating, Watchlist, Genre, MovieGenre } from '../models/index.js';
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