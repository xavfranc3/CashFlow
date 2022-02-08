import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import config from './ormconfig';
import RootController from './modules/root/root.controller';
import AuthenticationController from './modules/authentication/authentication.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

(async () => {
  try {
    await createConnection(config);
  } catch (error) {
    console.log('Error while connecting to database', error);
    return error;
  }
  const app = new App([new RootController(), new AuthenticationController()]);
  app.listen();
})();
