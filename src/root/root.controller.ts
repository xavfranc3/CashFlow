import * as express from 'express';
import Controller from '../interfaces/controller.interface';

class RootController implements Controller {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.welcomeMessage);
  }

  private welcomeMessage = (req: express.Request, res: express.Response) => {
    res.status(200).send('Welcome to the Cash Flow App! Making your Cash Flow Management as fluid as can be!');
  };
}

export default RootController;
