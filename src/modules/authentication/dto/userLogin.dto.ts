import { IsEmail, IsString } from 'class-validator';

class UserLoginDto {
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export default UserLoginDto;
