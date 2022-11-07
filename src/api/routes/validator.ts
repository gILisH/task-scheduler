import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import Joi from "joi";

export interface AddTaskRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    url:string,
    hours: number,
    minutes: number,
    seconds: number,
  }
}

export const addTaskBodySchema = Joi.object({
  url:Joi.string().required(),
  hours: Joi.number().required(),
  minutes: Joi.number().required(),
  seconds: Joi.number().required(),
});

export const getTaskParamsSchema = Joi.object({
  id:Joi.number().required()
});

export interface GetTaskRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id?:number
  }
}