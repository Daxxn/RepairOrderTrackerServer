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

export type BaseObjects =
  | PayPeriodObjects
  | RepairOrderObjects
  | JobObjects
  | TechObjects;

export type BaseDoc = PayPeriodDoc | RepairOrderDoc | JobDoc | TechDoc;

export type BaseModel =
  | PayPeriodModel
  | RepairOrderModel
  | JobModel
  | TechModel;
