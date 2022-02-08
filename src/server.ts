import 'dotenv/config';
import App from './app';
import RootController from './root/root.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new RootController()]);
app.listen();
