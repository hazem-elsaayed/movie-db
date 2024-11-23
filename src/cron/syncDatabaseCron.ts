import cron from 'node-cron';
import { TMDBService } from '../services/tmdbService.js';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const tmdbService = new TMDBService();

// Schedule the cron job to run at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily database sync from TMDB...');

  try {
    await sequelize.sync();

    console.log('Syncing genres...');
    await tmdbService.syncGenres();

    console.log('Syncing movies...');
    await tmdbService.syncMovies(Number(process.env.TMDB_SYNC_PAGES));

    console.log('Database sync completed successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});