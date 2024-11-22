import { TMDBService } from '../services/tmdbService.js';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

async function syncDatabase() {
  try {
    await sequelize.sync();

    const tmdbService = new TMDBService();

    console.log('Syncing genres...');
    await tmdbService.syncGenres();

    console.log('Syncing movies...');
    await tmdbService.syncMovies(Number(process.env.TMDB_SYNC_PAGES));

    console.log('Database sync completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();