import CreateUserDto from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import UserEntity from '../../entities/user';
import IUser from '../users/user.interface';
import * as jwt from 'jsonwebtoken';
import TokenData from './tokenData.interface';
import DataStoredInToken from './interfaces/dataStoredInToken.interface';

class AuthenticationService {
  private userRepository = getRepository(UserEntity);

  public registerUser = async (userData: CreateUserDto) => {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  };

  public matchPassword = async (loginPassword, userPassword) => {
    const isMatching = bcrypt.compareSync(loginPassword, userPassword);
    if (isMatching) {
      return true;
    }
  };

  public createToken = (user: IUser): TokenData => {
    const expiresIn = 60 * 600;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user.id,
    };
    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  };

  public createCookie = (tokenData: TokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};Path=/;`;
  };
}

export default AuthenticationService;
