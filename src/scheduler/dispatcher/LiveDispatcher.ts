import { DispatcherInterface } from './DispatcherInterface';
import { Task } from '../model/Task';
import TaskQueueInterface from '../queue/TaskQueueInterface';
import axios from 'axios';
import { map } from 'lodash';
import * as logger from '../../utils/logger';

export class LiveDispatcher implements DispatcherInterface {
  _dispatchCallBack: ((taskId: number) => void) | null = null;

  constructor(preDispatchCallBack?: (taskId: number) => void) {
    this._dispatchCallBack = preDispatchCallBack!;
  }

  dispatchTask = (task: Task): void => {
    logger.info(`🔥 task ${task.id} `);
    const url = `${task.url}/${task.id}`;
    axios
      .post<any>(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .then()
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          logger.error('error message: ', error.message);
        } else {
          logger.error('unexpected error: ', error);
        }
      });

    if (this._dispatchCallBack) {
      this._dispatchCallBack(task.id!);
    }
  };

  dispatchTasks = (tasks: Task[]): void => {
    //console.log(`dispatching ${tasks.length} tasks`);
    map(tasks, (task) => {
      this.dispatchTask(task);
    });
  };
}
