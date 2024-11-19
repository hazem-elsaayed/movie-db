import express, { Application } from 'express';
import cors from 'cors';

class App {
  public app: Application;
  public port: number;

  constructor(port: number = 8080) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
  }

  private initializeRoutes() {
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const app = new App();
app.listen();