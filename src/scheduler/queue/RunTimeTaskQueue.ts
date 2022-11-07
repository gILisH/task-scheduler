import TaskQueueInterface from './TaskQueueInterface';
import { Task } from '../model/Task';
import { getEpochInSeconds } from '../../utils/utils';

export class RunTimeTaskQueue implements TaskQueueInterface {
  tasks: Task[] = [];
  counter = 0;

  async addTask(task: Task): Promise<number | undefined> {
    task.id = this.counter;
    this.counter++;
    this.tasks.push(task);
    //console.log(JSON.stringify(this.tasks));
    return task.id;
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    const task: Task | undefined = this.tasks.find((task) => {
      return task.id == taskId;
    });
    return task ? task : null;
  }

  markTaskCompleted = async (taskId: number) => {
    let _task = await this.getTaskById(taskId);
    if (_task) {
      _task.success = true;
    }
  };

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
    const timeInSeconds = getEpochInSeconds(time);
    return this.tasks.filter((task) => {
      const taskTimeInSeconds = getEpochInSeconds(task.time);
      if (includeOld) {
        return taskTimeInSeconds <= timeInSeconds && (filterBySuccess ? task.success == successValue : true);
      } else {
        return taskTimeInSeconds == timeInSeconds && (filterBySuccess ? task.success == successValue : true);
      }
    });
  }

  start(): void {}
}
