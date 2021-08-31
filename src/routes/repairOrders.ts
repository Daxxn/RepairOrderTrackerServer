import express, { Router } from 'express';
import mongoose from 'mongoose';
import { createUserModel, UserModel } from '../models/userModel';
import {
  RepairOrderModel,
  createRepairOrderModel,
  RepairOrderDoc,
} from '../models/repairOrderModel';
import {
  PayPeriodModel,
  createPayPeriodModel,
} from '../models/payperiodModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createRepairOrderRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
  const RepairOrder: RepairOrderModel = createRepairOrderModel(db);
  const PayPeriod: PayPeriodModel = createPayPeriodModel(db);

  router.get('/byuser/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (userId) {
        const user = await User.findById(userId);
        const allROs = await RepairOrder.find({
          userId: user._id,
        });
        res.status(200).json(allROs);
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundRO = await RepairOrder.findById(id);
        if (foundRO) {
          const popRO = await foundRO.populate('jobs').execPopulate();
          res.status(200).json(popRO);
        } else {
          res
            .status(400)
            .json({ message: messages.modelNotFound(foundRO) });
        }
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  // #region POST Gen 1
  // router.post('/', async (req, res, next) => {
  //   try {
  //     const { body } = req;
  //     if (body) {
  //       const newRO = new RepairOrder(body);
  //       await newRO.save();
  //       res.status(201).json(newRO);
  //     } else {
  //       res.status(400).json({ message: messages.noBody });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // });
  // #endregion

  //#region POST Gen 2
  router.post('/:parentId', async (req, res, next) => {
    try {
      if (req.session.userId) {
        const { userId } = req.session;
        const { parentId } = req.params;
        const foundUser = await User.findById(userId);
        if (foundUser) {
          const newRO = new RepairOrder({
            userId,
          });
          const payPeriod = await PayPeriod.findById(parentId);
          const savedRO = await newRO.save();
          payPeriod.repairOrders.push(savedRO._id);
          await payPeriod.save();
          res.status(201).json(savedRO);
        } else {
          res.status(400).json({ message: messages.badSession });
        }
      } else {
        res.status(400).json({ message: messages.badSession });
      }
    } catch (err) {
      next(err);
    }
  });
  //#endregion

  router.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body } = req;
      if (id) {
        if (body) {
          const foundRO = await RepairOrder.findById(id);
          if (foundRO) {
            Object.assign(foundRO, body);
            const updatedRO = await foundRO.save();
            res.status(200).json(updatedRO);
          } else {
            res.status(400).json({
              message: messages.modelNotFound<RepairOrderDoc>(foundRO),
            });
          }
        } else {
          res.status(400).json({ message: messages.noBody });
        }
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundRO = await RepairOrder.findById(id);
        await Promise.all([
          RepairOrder.deleteOne({ _id: foundRO._id }),
          PayPeriod.updateOne(
            { repairOrders: foundRO._id },
            { $pull: { RepairOrders: foundRO._id } }
          ),
        ]);
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};

export default createRepairOrderRoute;
