import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import CreateUserDto from './dto/createUser.dto';
import UserEntity from '../../entities/user';
import { getRepository } from 'typeorm';
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private userRepository = getRepository(UserEntity);
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registerUser);
    this.router.post(`${this.path}/login`, this.loginUser);
  }

  private registerUser = async (req: express.Request, res: express.Response) => {
    const userData: CreateUserDto = req.body;
    if (await this.userRepository.findOne({ email: userData.email })) {
      res.status(403).json(`Email address ${userData.email} is already registered`);
    } else {
      const newUser: UserEntity = await this.authenticationService.registerUser(userData);
      res.status(201).json(newUser);
    }
  };

  private loginUser = async (req: express.Request, res: express.Response) => {};
}

export default AuthenticationController;
