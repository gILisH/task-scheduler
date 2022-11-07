import express, { Express } from 'express';
import { initDB } from './db/db.config';
import schedulerRouter from './api/routes/scheduler';
import { SchedulerService } from './services/SchedulerService';
import * as logger from './utils/logger';

const app: Express = express();
const port = 3000;

const initServices = () => {
  SchedulerService.getInstance().init();
};

app.use(express.json());
app.use('/', schedulerRouter);

app.listen(port, async () => {
  await initDB();
  initServices();
  logger.info(`⚡️[server]: Server is running at https://localhost:${port}`);
});
