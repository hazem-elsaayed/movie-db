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

@Table({ tableName: 'ratings', timestamps: true })
export class Rating extends Model {
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

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 10,
    },
  })
  rating!: number;

  @BelongsTo(() => User)
  user!: IUser;

  @BelongsTo(() => Movie)
  movie!: IMovie;
}
