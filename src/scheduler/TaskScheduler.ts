import { Task } from './model/Task';
import TaskQueueInterface from './queue/TaskQueueInterface';
import { SimpleQueueFetcher } from './fetcher/SimpleQueueFetcher';
import { DispatcherInterface } from './dispatcher/DispatcherInterface';
import { MySQLWCacheTaskQueue } from './queue/MySQLWCacheTaskQueue';
import { LiveDispatcher } from './dispatcher/LiveDispatcher';

export class TaskScheduler {
  _queue: TaskQueueInterface | undefined;
  _dispatcher: DispatcherInterface | undefined;
  _fetcher: SimpleQueueFetcher | undefined;
  constructor() {
    //this._queue = new RunTimeTaskQueue();
    //this._queue = new MySQLTaskQueue();
    this._queue = new MySQLWCacheTaskQueue();
    this._dispatcher = new LiveDispatcher(this._queue.markTaskCompleted);
    this._fetcher = new SimpleQueueFetcher(this._queue, this._dispatcher, true);
  }

  start = () => {
    this._queue?.start();
    this._fetcher?.start();
  };

  async addTask(task: Task): Promise<number | undefined> {
    return this._queue?.addTask(task);
  }

  async getTask(taskId: number): Promise<Task | null | undefined> {
    return this._queue?.getTaskById(taskId);
  }
}
