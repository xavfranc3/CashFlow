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
    this.router.post(`${this.path}/logout`, this.logoutUser);
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
        const tokenData = this.authenticationService.createToken(user);
        res.setHeader('Set-Cookie', this.authenticationService.createCookie(tokenData));
        res.status(200).json(`User ${user.name} is logged in`);
      } else {
        res.status(403).send('Wrong credentials, request unauthorized');
      }
    } else {
      res.status(403).send('Wrong credentials, request unauthorized');
    }
  };

  private logoutUser = (req: express.Request, res: express.Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    res.sendStatus(200);
  };
}

export default AuthenticationController;
