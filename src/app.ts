import express, { Application } from 'express';
import sequelize from './config/database.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import { setupSwagger } from './config/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import limiter from './middlewares/rateLimiter.js';
import './cron/syncDatabaseCron.js';

dotenv.config();

class App {
  public app: Application;

  constructor(private port: number = 8080) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(limiter);
    setupSwagger(this.app);
  }
  
  private initializeRoutes() {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/movies', movieRoutes);
    this.app.use('/api/watchlist', watchlistRoutes);
    this.app.use(errorHandler);
  }

  private async initializeDatabase() {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized.');
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const app = new App();
app.listen();
