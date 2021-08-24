import bodyParser from 'body-parser';
import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MessageHelper from '../utils/messageHelper';
import { UserModel, UserDoc, createUserModel } from '../models/userModel';
import {
  createPayPeriodModel,
  PayPeriodDoc,
  PayPeriodModel,
  PayPeriodObjects,
} from '../models/payperiodModel';
import { AuthConfig } from '../utils/authCheck';
import {
  RepairOrderModel,
  createRepairOrderModel,
  RepairOrderObjects,
} from '../models/repairorderModel';
import { BaseDoc, BaseObjects } from '../utils/types';
import DbFunctions from '../utils/dbFunctions';
import { JobModel, createJobModel, JobObjects } from '../models/jobModel';
import {
  TechModel,
  createTechModel,
  TechObjects,
} from '../models/techModel';

const router = express.Router();
const messages = MessageHelper.get();

// const populateUserData = async (user: UserDoc): Promise<UserDoc> => {
//   return await user.populate('payPeriods').execPopulate();
// };

// const getUserPayperiods = async (user: UserDoc, payPeriods: PayPeriodModel): Promise<PayPeriodDoc[]> => {
//   return await payPeriods.find({
//     _id: user.payPeriods,
//   });
// };

// const buildPayPeriodObjects = (payPeriods: PayPeriodDoc[]): PayPeriodObjects => {
//   const payPeriodObjects: PayPeriodObjects = {};
//   if (payPeriods.length > 0) {
//     Object.values(payPeriods).forEach(pp => {
//       payPeriodObjects[pp._id] = pp;
//     });
//   }
//   return payPeriodObjects;
// };

// const buildObjects = (docs: BaseDoc[]): BaseObjects => {
//   const objects: BaseObjects = {};
//   if (docs.length > 0) {
//     Object.values(docs).forEach(doc => {
//       objects[doc._id] = doc;
//     });
//   }
//   return objects;
// };

const createUserRoute = (
  db: typeof mongoose,
  config: AuthConfig
): Router => {
  const User: UserModel = createUserModel(db);
  const PayPeriods: PayPeriodModel = createPayPeriodModel(db);
  const RepairOrder: RepairOrderModel = createRepairOrderModel(db);
  const Job: JobModel = createJobModel(db);
  const Tech: TechModel = createTechModel(db);

  router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (config.env === 'dev') {
          const users = await User.find();
          res.status(200).json(users);
        } else {
          res.status(401).json({ message: messages.adminOnlyForUsers });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const foundUser = await User.findById(id);
      if (foundUser) {
        console.log('Logging found user paystub IDs');
        console.log(Object.keys(foundUser.payPeriods));
        const payPeriods = (await DbFunctions.findByIds(
          Object.keys(foundUser.payPeriods),
          PayPeriods
        )) as PayPeriodObjects;
        const repairOrders = (await DbFunctions.findByIds(
          Object.keys(payPeriods),
          RepairOrder
        )) as RepairOrderObjects;
        const jobs = await DbFunctions.findByIds(
          Object.keys(repairOrders),
          Job
        );
        const techs = await DbFunctions.findByIds(Object.keys(jobs), Tech);
        res.status(200).json({
          user: foundUser,
          payPeriods: payPeriods as PayPeriodObjects,
          repairOrders: repairOrders as RepairOrderObjects,
          jobs: jobs as JobObjects,
          techs: techs as TechObjects,
        });
      } else {
        res.status(400).json({ message: messages.noUserFound });
      }
    } catch (err) {
      next(err);
    }
  });

  router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userName } = req.body;
        if (userName) {
          const foundUser = await User.find({
            userName,
          });
          console.log(foundUser);
          if (foundUser.length <= 0) {
            const newUser = new User({
              userName,
            });
            await newUser.save();
            res.status(201).json(newUser);
          } else {
            res.status(400).json({
              message: messages.userNameExists,
            });
          }
        } else {
          res.status(400).json({
            message: messages.noUserName,
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { body } = req;
        if (body) {
          const foundUser = await User.findById(req.params.id);
          if (foundUser) {
            if (body._id) {
              delete body._id;
            }
            if (body.userName) {
              delete body.userName;
            }
            Object.assign(foundUser, req.body);
            await foundUser.save();
            res.status(200).json(foundUser);
          } else {
            res.status(400).json({
              message: messages.noUserFound,
            });
          }
        } else {
          res.status(400).json({
            message: messages.noBody,
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        if (id) {
          const foundUser = await User.findById(id);
          if (foundUser) {
            await foundUser.remove();
            res.status(200).json({
              message: messages.userDeleted,
            });
          } else {
            res.status(400).json({
              message: messages.noUserFound,
            });
          }
        } else {
          res.status(400).json({
            message: messages.noId,
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );
  return router;
};

export default createUserRoute;
