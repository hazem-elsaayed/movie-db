import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  Default,
} from 'sequelize-typescript';
import { Rating } from './rating';
import { User } from './user';
import { Watchlist } from './watchlist';
import { Genre } from './genre';
import { MovieGenre } from './movieGenre';

@Table({ tableName: 'movies', timestamps: true })
export class Movie extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  tmdbId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  overview!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  posterPath!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  releaseDate!: Date;

  @Default(0)
  @Column({
    type: DataType.FLOAT,
  })
  averageRating!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  ratingCount!: number;

  @HasMany(() => Rating)
  ratings!: Rating[];

  @BelongsToMany(() => User, () => Watchlist)
  watchlistedBy!: User[];

  @BelongsToMany(() => Genre, () => MovieGenre)
  genres!: Genre[];
}
