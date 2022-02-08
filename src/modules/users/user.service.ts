import { getRepository } from 'typeorm';
import UserEntity from '../../entities/user';
import IUser from './user.interface';

class UserService {
  private userRepository = getRepository(UserEntity);

  public findUserByEmail = async (userData: IUser) => {
    return await this.userRepository.findOne({ email: userData.email });
  };
}

export default UserService;
