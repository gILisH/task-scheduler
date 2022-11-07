import { TaskScheduler } from '../scheduler/TaskScheduler';
import { Task } from '../scheduler/model/Task';

export class SchedulerService {
  static _instance: SchedulerService;
  static getInstance(): SchedulerService {
    if (!SchedulerService._instance) {
      SchedulerService._instance = new SchedulerService();
    }

    return SchedulerService._instance;
  }

  _taskScheduler: TaskScheduler = new TaskScheduler();
  _initialized = false;

  init = () => {
    this._taskScheduler.start();
    this._initialized = true;
  };

  addTask = async (task: Task): Promise<number | undefined> => {
    if (this._initialized) {
      return await this._taskScheduler.addTask(task);
    }
  };

  getTask = async (taskId: number): Promise<Task | null | undefined> => {
    if (this._initialized) {
      return await this._taskScheduler.getTask(taskId);
    }

    return null;
  };
}
