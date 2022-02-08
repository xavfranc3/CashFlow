import * as bodyParser from 'body-parser';
import * as express from 'express';
import Controller from './interfaces/controller.interface';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = Number(process.env.PORT) || 4000;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }
}

export default App;
