import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import CreateUserDto from './dto/createUser.dto';
import UserEntity from '../../entities/user';
import AuthenticationService from './authentication.service';
import UserLoginDto from './dto/userLogin.dto';
import UserService from '../users/user.service';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.registerUser);
    this.router.post(`${this.path}/login`, this.loginUser);
  }

  private registerUser = async (req: express.Request, res: express.Response) => {
    const userData: CreateUserDto = req.body;
    if (await this.userService.findUserByEmail(userData)) {
      res.status(403).json(`Email address ${userData.email} is already registered`);
    } else {
      const newUser: UserEntity = await this.authenticationService.registerUser(userData);
      const response = { id: newUser.id, name: newUser.name, email: newUser.email };
      res.status(201).json(response);
    }
  };

  private loginUser = async (req: express.Request, res: express.Response) => {
    const loginData: UserLoginDto = req.body;
    const user = await this.userService.findUserByEmail(loginData);
    if (user) {
      const checkCredentials: boolean = await this.authenticationService.matchPassword(
        loginData.password,
        user.password,
      );
      if (checkCredentials) {
        const response = { id: user.id, name: user.name, email: user.email };
        res.status(200).json(response);
      } else {
        res.status(403).send('Wrong credentials, request unauthorized');
      }
    } else {
      res.status(403).send('Wrong credentials, request unauthorized');
    }
  };
}

export default AuthenticationController;
