import { Task } from '../model/Task';

export interface DispatcherInterface {
  dispatchTask(task: Task): void;
  dispatchTasks(tasks: Task[]): void;
}
