import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import config from './ormconfig';
import validateEnv from './utils/validateEnv';

validateEnv();

(async () => {
  try {
    await createConnection(config);
  } catch (error) {
    console.log('Error while connecting to database', error);
    return error;
  }
  const app = new App([]);
  app.listen();
})();
