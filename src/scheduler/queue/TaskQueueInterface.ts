import { Task } from '../model/Task';

interface TaskQueueInterface {
  getTaskById(taskId: number): Promise<Task | null>;
  addTask(task: Task): Promise<number | undefined>;
  markTaskCompleted(taskId: number): void;
  getTasks({
    time,
    includeOld = true,
    filterBySuccess = false,
    successValue = false,
  }: {
    time: Date;
    includeOld?: boolean;
    filterBySuccess?: boolean;
    successValue?: boolean;
  }): Promise<Task[]>;
  start(): void;
}

export default TaskQueueInterface;
