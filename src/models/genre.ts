import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Movie } from './movie';
import { MovieGenre } from './movieGenre';

@Table({ tableName: 'genres', timestamps: true })
export class Genre extends Model {
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
  name!: string;

  @BelongsToMany(() => Movie, () => MovieGenre)
  movies!: Movie[];
}