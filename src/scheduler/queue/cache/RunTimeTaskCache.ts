import { TaskCacheInterface } from './TaskCacheInterface';
import { Task } from '../../model/Task';
import TaskQueueInterface from '../TaskQueueInterface';
import { addMinutesToDate, getEpochInSeconds } from '../../../utils/utils';
import NodeCache from 'node-cache';
import * as logger from '../../../utils/logger';

export class RunTimeTaskCache implements TaskCacheInterface {
  _sizeOfCacheInMinutes: number = 1;

  _completedTasks: NodeCache = new NodeCache({
    stdTTL: this._sizeOfCacheInMinutes * 1.1 * 60,
    checkperiod: this._sizeOfCacheInMinutes * 60,
  });

  _tasksMap: NodeCache = new NodeCache({
    stdTTL: this._sizeOfCacheInMinutes * 1.1 * 60,
    checkperiod: this._sizeOfCacheInMinutes * 60,
  });

  _intervalToFetchTasksToCacheInMinutes: number = this._sizeOfCacheInMinutes;

  start(queue: TaskQueueInterface, sizeOfCacheInMinutes: number = 1) {
    if (sizeOfCacheInMinutes != 1) {
      this._sizeOfCacheInMinutes = sizeOfCacheInMinutes;
      this._intervalToFetchTasksToCacheInMinutes = this._sizeOfCacheInMinutes;
      this._tasksMap = new NodeCache({
        stdTTL: this._sizeOfCacheInMinutes * 60,
        checkperiod: this._sizeOfCacheInMinutes * 60,
      });

      this._completedTasks = new NodeCache({
        stdTTL: this._sizeOfCacheInMinutes * 1.1 * 60,
        checkperiod: this._sizeOfCacheInMinutes * 60,
      });
    }

    this.fetchTasksFromQueueToCache(queue);
    const intervalID = setInterval(() => {
      this.fetchTasksFromQueueToCache(queue);
    }, this._intervalToFetchTasksToCacheInMinutes * 60 * 1000);
  }

  maxTimeOfTasksInCache() {
    return addMinutesToDate(new Date(), this._sizeOfCacheInMinutes);
  }

  addTaskIfNeeded(task: Task) {
    // we only add tasks within the range of cache
    if (task.time > this.maxTimeOfTasksInCache()) {
      return;
    }

    // task was completed not long ago, but was fetched before db was updated with completion
    if (task.id && this._completedTasks.get(task.id)) {
      logger.debug(`task  ${task.id} found completed - not adding to cache`);
      return;
    }

    // if task time is in the past - adding it to the next batch ,so it is not left behind.
    let timeInSeconds = 0;
    if (task.time <= new Date()) {
      timeInSeconds = getEpochInSeconds(new Date()) + 1;
    } else {
      timeInSeconds = getEpochInSeconds(task.time);
    }

    const tasksAtTime: Task[] | undefined = this._tasksMap.get(timeInSeconds);
    if (tasksAtTime) {
      if (
        !tasksAtTime.find((taskInCache) => {
          return taskInCache.id == task.id;
        })
      ) {
        this._tasksMap.set(timeInSeconds, [...tasksAtTime, task]);
        logger.debug(`task  ${task.id} retrieved and added to cache at key ${timeInSeconds}`);
      } else {
        logger.debug(`task ${task.id} retrieved but is already in cache.`);
      }
    } else {
      this._tasksMap.set(timeInSeconds, [task]);
      logger.debug(`task  ${task.id} retrieved and added to cache at key ${timeInSeconds}`);
    }
  }

  markTaskCompleted(taskId: number) {
    this._completedTasks.set(taskId, true);
  }

  async getTasks(time: Date): Promise<Task[]> {
    const tasks: Task[] = this._tasksMap.get(getEpochInSeconds(time)) || [];
    let arrStr = '';
    if (tasks.length) {
      for (const t of tasks) {
        arrStr += `${t.id},`;
      }
    }
    logger.info(`Found ${tasks.length} tasks in cache (${arrStr}) at ${getEpochInSeconds(time)}`);
    return tasks;
  }

  private async fetchTasksFromQueueToCache(queue: TaskQueueInterface) {
    const tasks: Task[] = await queue.getTasks({
      time: this.maxTimeOfTasksInCache(),
      includeOld: true,
      filterBySuccess: true,
      successValue: false,
    });
    this.populateCache(tasks);
  }

  private populateCache(tasks: Task[]) {
    for (const task of tasks) {
      this.addTaskIfNeeded(task);
    }
  }
}
