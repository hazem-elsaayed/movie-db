import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Rating } from './rating.js';
import { Movie } from './movie.js';
import { Watchlist } from './watchlist.js';

@Table({
  tableName: 'users',
  timestamps: true,
  indexes: [{ fields: ['email'], unique: true }],
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
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
