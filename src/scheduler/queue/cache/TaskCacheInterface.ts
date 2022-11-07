import { Task } from '../../model/Task';
import TaskQueueInterface from '../TaskQueueInterface';

export interface TaskCacheInterface {
  addTaskIfNeeded(task: Task): void;
  getTasks(time: Date): Promise<Task[]>;
  maxTimeOfTasksInCache(): Date;
  markTaskCompleted(taskId: number): void;
  start(queue: TaskQueueInterface): void;
}
