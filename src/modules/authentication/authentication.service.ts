import CreateUserDto from './dto/createUser.dto';
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
}

export default AuthenticationService;
