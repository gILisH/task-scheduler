import { Router, Request, Response } from 'express';
import { convertTaskTimerToDate, secondsLeftUntilTime } from '../../utils/utils';
import { SchedulerService } from '../../services/SchedulerService';
import { createValidator, ValidatedRequest } from "express-joi-validation";
import { addTaskBodySchema, AddTaskRequestSchema, getTaskParamsSchema, GetTaskRequestSchema } from "./validator";
const validator = createValidator()

const schedulerRouter = Router();

export const addTask = async (request: ValidatedRequest<AddTaskRequestSchema>, response: Response) => {
  const { hours, minutes, seconds, url } = request.body;
  const time = convertTaskTimerToDate(hours, minutes, seconds);
  const result =
      await SchedulerService.getInstance().addTask({ url, time, });
  return response.status(201).send(JSON.stringify(result));
};

export const getTask = async (request: ValidatedRequest<GetTaskRequestSchema>, response: Response) => {
  const taskId = Number(request.params.id);
  const task = await SchedulerService.getInstance().getTask(taskId);
  let result = {};
  if (task) {
    result = {
      id: task.id,
      time_left: secondsLeftUntilTime(task.time),
    };
  }
  return response.status(201).send(result);
};

schedulerRouter.post(`/task`, validator.body(addTaskBodySchema), addTask);
schedulerRouter.get(`/task/:id`, validator.params(getTaskParamsSchema), getTask);

export default schedulerRouter;
