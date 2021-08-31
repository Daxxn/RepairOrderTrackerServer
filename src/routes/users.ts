import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MessageHelper from '../utils/messageHelper';
import { UserModel, createUserModel } from '../models/userModel';
import {
  createPayPeriodModel,
  PayPeriodModel,
  PayPeriodObjects,
} from '../models/payperiodModel';
import { AuthConfig } from '../utils/authCheck';
import {
  RepairOrderModel,
  createRepairOrderModel,
  RepairOrderObjects,
} from '../models/repairOrderModel';
import DbFunctions from '../utils/dbFunctions';
import { JobModel, createJobModel, JobObjects } from '../models/jobModel';
import {
  TechModel,
  createTechModel,
  TechObjects,
} from '../models/techModel';

const router = express.Router();
const messages = MessageHelper.get();

const createUserRoute = (
  db: typeof mongoose,
  config: AuthConfig
): Router => {
  const User: UserModel = createUserModel(db);
  const PayPeriod: PayPeriodModel = createPayPeriodModel(db);
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

  router.get('/auth-id/:authId', async (req, res, next) => {
    try {
      const { authId } = req.params;
      if (authId) {
        const foundUser = await User.findOne({
          authId: authId,
        });
        if (foundUser) {
          if (!DbFunctions.checkSession(foundUser._id, req)) {
            req.session.userId = foundUser._id;
          }
          res.status(200).json(foundUser);
        } else {
          res.status(200).json({
            message: messages.noUserFound,
          });
        }
      } else {
        next(
          new Error(
            'Somehow ended up here. should have been routed to a different endpoint.'
          )
        );
      }
    } catch (err) {
      next(err);
    }
  });

  // #region UserData Routes
  router.post('/', async (req, res, next) => {
    try {
      const { body } = req;
      if (body) {
        const foundUser = await User.find({
          authId: body.authId,
        });
        if (!foundUser) {
          if (body._id) {
            delete body._id;
          }
          const newUser = new User(body);
          const savedUser = await newUser.save();
          res.status(201).json(savedUser);
        } else {
          res.status(400).json({
            message: messages.userExists,
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
  });

  router.post('/data', async (req, res, next) => {
    try {
      if (req.session.userId) {
        const foundUser = await User.findById(req.session.userId);
        if (foundUser) {
          const userData = await DbFunctions.findAllUserModels(
            {
              PayPeriod,
              RepairOrder,
              Job,
              Tech,
            },
            DbFunctions.getQuerry(foundUser._id)
          );
          res.status(200).json({
            PayPeriods: userData[0],
            RepairOrders: userData[1],
            Jobs: userData[2],
            Techs: userData[3],
          });
        } else {
          res.status(400).json({
            message: messages.badSession,
          });
        }
      } else {
        res.status(400).json({
          message: messages.badSession,
        });
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/data/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (req.session.userId) {
        const foundUser = await User.findById(req.session.userId);
        if (foundUser) {
          // get all the data...
        } else {
          res.status(400).json({
            message: messages.badSession,
          });
        }
      } else {
        if (id) {
          const foundUser = await User.findById(req.session.userId);
          if (foundUser) {
            req.session.userId = foundUser._id;
            const userData = await DbFunctions.findAllUserModels(
              {
                PayPeriod,
                RepairOrder,
                Job,
                Tech,
              },
              DbFunctions.getQuerry(foundUser._id)
            );
            res.status(200).json({
              PayPeriods: userData[0],
              RepairOrders: userData[1],
              Jobs: userData[2],
              Techs: userData[3],
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
        res.status(400).json({
          message: messages.noUserFound,
        });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

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
