import bodyParser from 'body-parser';
import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose, { FilterQuery } from 'mongoose';
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
} from '../models/repairOrderModel';
import { BaseDoc, BaseModel, BaseObject, BaseType } from '../utils/types';
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

const constructDict = (data: BaseDoc[]): BaseObject => {
  const output: BaseObject = {};
  data.forEach(item => {
    output[item._id] = item;
  });
  return output;
};

type DocContainer = {
  PayPeriod: PayPeriodModel;
  RepairOrder: RepairOrderModel;
  Job: JobModel;
  Tech: TechModel;
};

const findAllUserModels = (
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
        res(constructDict(result) as PayPeriodObjects);
      });
    }),
    new Promise<RepairOrderObjects>((res, rej) => {
      documents.RepairOrder.find(querry).exec((err, result) => {
        if (err) {
          rej(err);
        }
        res(constructDict(result) as RepairOrderObjects);
      });
    }),
    new Promise<JobObjects>((res, rej) => {
      documents.Job.find(querry).exec((err, result) => {
        if (err) {
          rej(err);
        }
        res(constructDict(result) as JobObjects);
      });
    }),
    new Promise<TechObjects>((res, rej) => {
      documents.Tech.find(querry).exec((err, result) => {
        if (err) {
          rej(err);
        }
        res(constructDict(result) as TechObjects);
      });
    }),
  ]);
};

const createUserRoute = (
  db: typeof mongoose,
  config: AuthConfig
): Router => {
  const User: UserModel = createUserModel(db);
  const PayPeriod: PayPeriodModel = createPayPeriodModel(db);
  const RepairOrder: RepairOrderModel = createRepairOrderModel(db);
  const Job: JobModel = createJobModel(db);
  const Tech: TechModel = createTechModel(db);

  // router.options('/', (req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');
  //   next();
  // });

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

  router.get('/username/:userName', async (req, res, next) => {
    try {
      const { userName } = req.params;
      if (userName) {
        const foundUser = await User.findOne({ userName: userName });
        if (foundUser) {
          res.status(200).json(foundUser);
        } else {
          res.status(400).json({ message: messages.noUserFound });
        }
      } else {
        res.status(400).json({ message: messages.noUserName });
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/email/:email', async (req, res, next) => {
    try {
      const { email } = req.params;
      if (email) {
        const foundUser = await User.findOne({ email: email });
        if (foundUser) {
          res.status(200).json(foundUser);
        } else {
          res.status(400).json({ message: messages.noUserFound });
        }
      } else {
        res.status(400).json({ message: messages.noUserName });
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const foundUser = await User.findById(id);
      if (foundUser) {
        console.log('Logging found user paystub IDs');
        console.log(Object.keys(foundUser.payPeriods));
        const payPeriods = (await DbFunctions.findByIds(
          Object.keys(foundUser.payPeriods),
          PayPeriod
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
        const { email } = req.body;
        if (email) {
          let currentUser;
          let statusCode = 0;
          const foundUser = await User.findOne({
            email: email,
          });

          if (!foundUser) {
            const newUser = new User({
              email: email,
            });
            await newUser.save();
            req.session.userId = newUser._id;
            currentUser = newUser;
            statusCode = 201;
          } else {
            req.session.userId = foundUser._id;
            currentUser = foundUser;
            statusCode = 200;
          }
          const querry = {
            userId: currentUser._id,
          };
          // const payPeriods = await PayPeriods.find(querry);
          // const repairOrders = await RepairOrder.find(querry);
          // const jobs = await Job.find(querry);
          // const techs = await Tech.find(querry);
          const userData = await findAllUserModels(
            {
              PayPeriod,
              RepairOrder,
              Tech,
              Job,
            },
            querry
          );

          res.status(statusCode).json({
            user: currentUser,
            payPeriods: userData[0],
            repairOrders: userData[1],
            jobs: userData[2],
            techs: userData[3],
          });
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
