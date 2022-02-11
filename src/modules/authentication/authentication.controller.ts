import * as express from 'express';
import Controller from '../../interfaces/controller.interface';
import CreateUserDto from './dto/createUser.dto';
import UserEntity from '../../entities/user';
import AuthenticationService from './authentication.service';
import UserLoginDto from './dto/userLogin.dto';
import UserService from '../users/user.service';
import DuplicateUserEmail from '../../exceptions/DuplicateUserEmail';
import WrongCredentials from '../../exceptions/WrongCredentials';
import validationMiddleware from '../../middlewares/validation.middleware';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registerUser);
    this.router.post(`${this.path}/login`, validationMiddleware(UserLoginDto), this.loginUser);
    this.router.post(`${this.path}/logout`, this.logoutUser);
  }

  private registerUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = req.body;
    if (await this.userService.findUserByEmail(userData)) {
      next(new DuplicateUserEmail(userData.email));
    } else {
      const newUser: UserEntity = await this.authenticationService.registerUser(userData);
      const response = { id: newUser.id, name: newUser.name, email: newUser.email };
      res.status(201).json(response);
    }
  };

  private loginUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
        next(new WrongCredentials());
      }
    } else {
      next(new WrongCredentials());
    }
  };

  private logoutUser = (req: express.Request, res: express.Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    res.sendStatus(200);
  };
}

export default AuthenticationController;
