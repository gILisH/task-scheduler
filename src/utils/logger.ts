import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';

const debug = (message: any, ...args: any[]) => {
  logger.debug(message, args);
};

const info = (message: any, ...args: any[]) => {
  logger.info(message, args);
};

const error = (message: any, ...args: any[]) => {
  logger.error(message, args);
};

export { debug, info, error };
