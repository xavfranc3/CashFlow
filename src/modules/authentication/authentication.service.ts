import CreateUserDto from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import UserEntity from '../../entities/user';

class AuthenticationService {
  private userRepository = getRepository(UserEntity);

  public registerUser = async (userData: CreateUserDto) => {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    newUser.password = undefined;
    return newUser;
  };

  public matchPassword = async (loginPassword, userPassword) => {
    const isMatching = bcrypt.compareSync(loginPassword, userPassword);
    if (isMatching) {
      return true;
    }
  };
}

export default AuthenticationService;
