import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  Default,
} from 'sequelize-typescript';
import { Rating } from './rating.js';
import { User } from './user.js';
import { Watchlist } from './watchlist.js';
import { Genre } from './genre.js';
import { MovieGenre } from './movieGenre.js';

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
    defaultValue: 0,
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
