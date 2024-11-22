import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Movie } from './movie.js';
import { Genre } from './genre.js';

@Table({ tableName: 'movie_genres', timestamps: true })
export class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  movieId!: number;

  @ForeignKey(() => Genre)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  genreId!: number;
}