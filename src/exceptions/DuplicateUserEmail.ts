import HttpException from './HttpException';

class DuplicateUserEmail extends HttpException {
  constructor(email: string) {
    super(401, `User with email: ${email} already exists`);
  }
}

export default DuplicateUserEmail;
