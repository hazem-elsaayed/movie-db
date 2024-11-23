import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Movie } from './movie.js';
import { User } from './user.js';
import { IMovie, IUser } from '../utils/interfaces.js';

@Table({
  tableName: 'watchlist',
  indexes: [{ fields: ['userId', 'movieId'], unique: true }],
})
export class Watchlist extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Movie)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  movieId!: number;

  @BelongsTo(() => User)
  user!: IUser;

  @BelongsTo(() => Movie)
  movie!: IMovie;
}
