import { Op } from 'sequelize';
import Task from '../models/Task';
import * as logger from '../../utils/logger';

export const create = async (url: string, time: Date): Promise<Task | null> => {
  try {
    return await Task.create({
      url,
      time: time.toISOString(),
    });
  } catch (e: any) {
    logger.error(e);
  }

  return null;
};

export const markCompleted = async (id: number) => {
  let updatedTask = null;
  try {
    updatedTask = await Task.update(
      {
        success: true,
      },
      {
        where: { id: id },
      }
    );
  } catch (e: any) {
    logger.error(e);
  }
  logger.info(` ✅  task ${id}`);
};

export const getById = async (id: number): Promise<Task | null> => {
  const task = await Task.findByPk(id);
  return task;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedTaskCount = await Task.destroy({
    where: { id },
  });
  return !!deletedTaskCount;
};

export const getAll = async ({
  time,
  includeOld = true,
  filterBySuccess = false,
  successValue = false,
}: {
  time: Date;
  includeOld?: boolean;
  filterBySuccess?: boolean;
  successValue?: boolean;
}): Promise<Task[]> => {
  return Task.findAll({
    where: {
      time: {
        [includeOld ? Op.lt : Op.eq]: time.toISOString(),
      },
      ...(filterBySuccess && {
        success: {
          [Op.eq]: successValue,
        },
      }),
    },
  });
};
