import { JobDoc, JobModel, JobObjects } from '../models/jobModel';
import {
  RepairOrderDoc,
  RepairOrderModel,
  RepairOrderObjects,
} from '../models/repairOrderModel';
import { TechDoc, TechModel, TechObjects } from '../models/techModel';
import {
  PayPeriodDoc,
  PayPeriodModel,
  PayPeriodObjects,
} from '../models/payperiodModel';

export type BaseObject =
  | PayPeriodObjects
  | RepairOrderObjects
  | JobObjects
  | TechObjects;

export type BaseDoc = PayPeriodDoc | RepairOrderDoc | JobDoc | TechDoc;
export type BaseType = 'PayPeriod' | 'RepairOrder' | 'Job' | 'Tech';

export type BaseModel =
  | PayPeriodModel
  | RepairOrderModel
  | JobModel
  | TechModel;
