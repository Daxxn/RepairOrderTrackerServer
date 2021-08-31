import { Request } from 'express';
import {
  RepairOrderDoc,
  RepairOrderModel,
  RepairOrderObjects,
} from '../models/repairOrderModel';
import {
  PayPeriodDoc,
  PayPeriodModel,
  PayPeriodObjects,
} from '../models/payperiodModel';
import { UserDoc } from '../models/userModel';
import { JobDoc, JobModel, JobObjects } from '../models/jobModel';
import { TechModel, TechObjects } from '../models/techModel';
import { BaseDoc, BaseModel, BaseObject } from './types';

export type DocContainer = {
  PayPeriod: PayPeriodModel;
  RepairOrder: RepairOrderModel;
  Job: JobModel;
  Tech: TechModel;
};

export default class DbFunctions {
  //#region Props

  //#endregion

  //#region Methods
  static getUserPayPeriods = async (
    user: UserDoc,
    payPeriods: PayPeriodModel
  ) => {
    // return await payPeriods.find({
    //   _id: { $in: user.payPeriods },
    // });
    const tempUser = await user.populate('payPeriods').execPopulate();
    return tempUser.payPeriods;
  };

  static getUserRepairOrders = async (
    payPeriod: PayPeriodDoc,
    repairOrders: RepairOrderModel
  ) => {
    return await repairOrders.find({
      _id: payPeriod.repairOrders,
    });
  };

  static getUserJobs = async (
    repairOrder: RepairOrderDoc,
    jobs: JobModel
  ) => {
    return await jobs.find({
      _id: repairOrder.jobs,
    });
  };

  static getUserTechs = async (job: JobDoc, Techs: TechModel) => {
    return await job.populate('assignedtech').execPopulate();
  };

  static findByIds = async (
    ids: string[],
    model: BaseModel
  ): Promise<BaseObject> => {
    const objects: BaseObject = {};
    ids.forEach(async id => {
      const obj = await model.findById(id);
      objects[obj._id] = obj;
    });
    console.log(objects);
    return objects;
  };

  static getQuerry = (userId: string) => {
    return {
      userId,
    };
  };

  static checkSession = (userId: string, req: Request): boolean => {
    if (req.session.userId) {
      if (req.session.userId == userId) {
        return true;
      }
      return false;
    }
    return false;
  };

  static constructDict = (data: BaseDoc[]): BaseObject => {
    const output: BaseObject = {};
    data.forEach(item => {
      output[item._id] = item;
    });
    console.log(output);
    return output;
  };

  static findAllUserModels = (
    documents: DocContainer,
    querry: any
  ): Promise<
    [PayPeriodObjects, RepairOrderObjects, JobObjects, TechObjects]
  > => {
    return Promise.all([
      new Promise<PayPeriodObjects>((res, rej) => {
        documents.PayPeriod.find(querry).exec((err, result) => {
          if (err) {
            rej(err);
          }
          res(DbFunctions.constructDict(result) as PayPeriodObjects);
        });
      }),
      new Promise<RepairOrderObjects>((res, rej) => {
        documents.RepairOrder.find(querry).exec((err, result) => {
          if (err) {
            rej(err);
          }
          res(DbFunctions.constructDict(result) as RepairOrderObjects);
        });
      }),
      new Promise<JobObjects>((res, rej) => {
        documents.Job.find(querry).exec((err, result) => {
          if (err) {
            rej(err);
          }
          res(DbFunctions.constructDict(result) as JobObjects);
        });
      }),
      new Promise<TechObjects>((res, rej) => {
        documents.Tech.find(querry).exec((err, result) => {
          if (err) {
            rej(err);
          }
          res(DbFunctions.constructDict(result) as TechObjects);
        });
      }),
    ]);
  };

  static createManyJobs(
    jobs: any[],
    Job: JobModel,
    parent: RepairOrderDoc
  ): Promise<JobDoc[]> {
    const promises = jobs.map(job => {
      return new Promise<JobDoc>((res, rej) => {
        const newJob = new Job(job);
        newJob
          .save()
          .then(savedJob => {
            parent.jobs.push(savedJob._id);
            res(savedJob);
          })
          .catch(err => rej(err));
      });
    });
    return Promise.all(promises);
  }
  //#endregion
}
