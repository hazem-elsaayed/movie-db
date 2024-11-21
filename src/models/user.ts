import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Rating } from './rating';
import { Movie } from './movie';
import { Watchlist } from './watchlist';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @HasMany(() => Rating)
  ratings!: Rating[];

  @BelongsToMany(() => Movie, () => Watchlist)
  watchlist!: Movie[];
}
