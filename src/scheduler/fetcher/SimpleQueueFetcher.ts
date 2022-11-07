import TaskQueueInterface from '../queue/TaskQueueInterface';
import { DispatcherInterface } from '../dispatcher/DispatcherInterface';

export class SimpleQueueFetcher {
  _dispatcher: DispatcherInterface;
  _intervalInSeconds: number;
  _queue: TaskQueueInterface;
  _includeOld: boolean;

  constructor(queue: TaskQueueInterface, dispatcher: DispatcherInterface, includeOld: boolean = false) {
    this._dispatcher = dispatcher;
    this._queue = queue;
    this._intervalInSeconds = 1;
    this._includeOld = includeOld;
  }

  start() {
    const intervalID = setInterval(() => {
      //console.log("checking for tasks ready to dispatch");
      this.fetchTasksAndDispatch().then((r) => null);
    }, this._intervalInSeconds * 1000);
  }

  async fetchTasksAndDispatch() {
    let tasks = await this._queue.getTasks({
      time: new Date(),
      includeOld: this._includeOld,
      filterBySuccess: true,
      successValue: false,
    });
    //console.log(JSON.stringify(tasks));
    await this._dispatcher.dispatchTasks(tasks);
  }
}
