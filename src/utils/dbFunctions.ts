import { RepairOrderDoc, RepairOrderModel } from '../models/repairorderModel';
import { PayPeriodDoc, PayPeriodModel } from '../models/payperiodModel';
import { UserDoc } from '../models/userModel';
import { JobDoc, JobModel } from '../models/jobModel';
import { TechModel } from '../models/techModel';
import { BaseModel, BaseObjects } from './types';

export default class DbFunctions {
  //#region Props
  
  //#endregion

  //#region Methods
  static getUserPayPeriods = async (user: UserDoc, payPeriods: PayPeriodModel) => {
    // return await payPeriods.find({
    //   _id: { $in: user.payPeriods },
    // });
    const tempUser = await user.populate('payPeriods').execPopulate();
    return tempUser.payPeriods;
  }

  static getUserRepairOrders = async (payPeriod: PayPeriodDoc, repairOrders: RepairOrderModel) => {
    return await repairOrders.find({
      _id: payPeriod.repairOrders,
    });
  }

  static getUserJobs = async (repairOrder: RepairOrderDoc, jobs: JobModel) => {
    return await jobs.find({
      _id: repairOrder.jobs,
    });
  }

  static getUserTechs = async (job: JobDoc, Techs: TechModel) => {
    return await job.populate('assignedtech').execPopulate();
  }

  static findByIds = async (ids: string[], model: BaseModel): Promise<BaseObjects> => {
    var objects: BaseObjects = {};
    ids.forEach(async id => {
      const obj = await model.findById(id);
      objects[obj._id] = obj;
    });
    return objects;
  }
  //#endregion
}