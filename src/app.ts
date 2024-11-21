import express, { Application } from 'express';
import sequelize from './config/database';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';

class App {
  public app: Application;
  public port: number;

  constructor(port: number = 8080) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    setupSwagger(this.app);
  }
  
  private initializeRoutes() {
    this.app.use('/api/auth', authRoutes);
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
