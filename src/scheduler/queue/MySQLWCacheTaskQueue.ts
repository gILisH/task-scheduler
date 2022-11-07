import { MySQLTaskQueue } from './MySQLTaskQueue';
import TaskQueueInterface from './TaskQueueInterface';
import { RunTimeTaskCache } from './cache/RunTimeTaskCache';
import { Task } from '../model/Task';
import { TaskCacheInterface } from './cache/TaskCacheInterface';
import * as TaskDal from '../../db/dal/task';

export class MySQLWCacheTaskQueue extends MySQLTaskQueue implements TaskQueueInterface {
  _cache: TaskCacheInterface;

  constructor() {
    super();
    this._cache = new RunTimeTaskCache();
  }

  addTask = async (task: Task): Promise<number | undefined> => {
    const taskId = await super.addTask(task);
    this._cache.addTaskIfNeeded({
      ...task,
      id: taskId,
    });
    return taskId;
  };

  getTasks = async ({
    time,
    includeOld = true,
    filterBySuccess = false,
    successValue = false,
  }: {
    time: Date;
    includeOld: boolean;
    filterBySuccess: boolean;
    successValue: boolean;
  }): Promise<Task[]> => {
    if (time < this._cache.maxTimeOfTasksInCache()) {
      return await this._cache.getTasks(time);
    } else {
      return await super.getTasks({ time, includeOld, filterBySuccess, successValue });
    }
  };

  markTaskCompleted = async (taskId: number) => {
    this._cache.markTaskCompleted(taskId);
    await super.markTaskCompleted(taskId);
  };

  start = () => {
    this._cache.start(this);
  };
}
