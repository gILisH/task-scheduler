import TaskQueueInterface from './TaskQueueInterface';
import { Task } from '../model/Task';
import * as TaskDal from '../../db/dal/task';
import * as MYSQLTask from '../../db/models/Task';

export class MySQLTaskQueue implements TaskQueueInterface {
  async addTask(task: Task): Promise<number | undefined> {
    const result = await TaskDal.create(task.url, task.time);
    return result ? result.id : undefined;
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    const result = await TaskDal.getById(taskId);
    return result ? convertMYSQLTaskToTask(result) : null;
  }

  async markTaskCompleted(taskId: number) {
    await TaskDal.markCompleted(taskId);
  }

  async getTasks({
    time,
    includeOld = true,
    filterBySuccess = false,
    successValue = false,
  }: {
    time: Date;
    includeOld?: boolean;
    filterBySuccess?: boolean;
    successValue?: boolean;
  }): Promise<Task[]> {
    return convertMYSQLTasksToTasks(await TaskDal.getAll({ time, includeOld, filterBySuccess, successValue }));
  }

  start(): void {}
}

function convertMYSQLTasksToTasks(tasks: MYSQLTask.default[]): Task[] {
  const result: Task[] = [];
  if (tasks) {
    for (const task of tasks) {
      result.push(convertMYSQLTaskToTask(task));
    }
    return result;
  }

  return [];
}
function convertMYSQLTaskToTask(task: MYSQLTask.default): Task {
  return {
    id: task.id,
    url: task.url,
    time: task.time,
    success: task.success,
  };
}
