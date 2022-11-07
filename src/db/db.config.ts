import { Dialect, Sequelize } from 'sequelize';
import { initTaskModel } from './models/Task';
const isDev = process.env.NODE_ENV === 'development';
import configFile from '../../config/config.json';
import * as logger from '../utils/logger';

const config = configFile.development;
export async function initDB() {
  await initTaskModel();
}

const sequelizeConnection = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as Dialect,
  port: config.port,
  logging: false,
});

sequelizeConnection
  .authenticate()
  .then(function () {
    logger.info('DB Connection has been established successfully.');
  })
  .catch(function (err) {
    logger.error(`DB Sequelize Connection Error: ${err}`);
  });

export default sequelizeConnection;
