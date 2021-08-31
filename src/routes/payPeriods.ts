import express, { Router } from 'express';
import mongoose from 'mongoose';
import { UserModel, createUserModel } from '../models/userModel';
import {
  PayPeriodModel,
  PayPeriodDoc,
  createPayPeriodModel,
} from '../models/payperiodModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createPayPeriodRoute = (db: typeof mongoose): Router => {
  const PayPeriod: PayPeriodModel = createPayPeriodModel(db);
  const User: UserModel = createUserModel(db);

  router.get('/', async (req, res, next) => {
    try {
      const allPayPeriods = await PayPeriod.find();
      res.status(200).json(allPayPeriods);
    } catch (err) {
      next(err);
    }
  });

  router.get('/byuser/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (userId) {
        const foundUser = await User.findById(userId);
        if (foundUser) {
          const foundPayPeriods = await PayPeriod.find({
            userId: foundUser._id,
          });
          console.log(foundPayPeriods);
          res.status(200).json(foundPayPeriods);
        } else {
          res.status(400).json({ message: messages.noUserFound });
        }
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
        const foundPayPeriod = await PayPeriod.findById(id);
        if (foundPayPeriod) {
          const popPayPeriod = await foundPayPeriod
            .populate('repairOrders')
            .execPopulate();
          res.status(200).json(popPayPeriod);
        } else {
          res.status(400).json({
            message: messages.modelNotFound(foundPayPeriod),
          });
        }
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  //#region New PayPeriod Routes
  router.post('/', async (req, res, next) => {
    try {
      if (req.session.userId) {
        const { userId } = req.session;
        const user = await User.findById(userId);
        const newPayPeriod = new PayPeriod({
          userId,
        });
        const savedPayPeriod = await newPayPeriod.save();
        if (!user.payPeriods.includes(savedPayPeriod._id)) {
          user.payPeriods.push(savedPayPeriod._id);
        }
        const savedUser = await user.save();
        res.status(201).json(savedUser);
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
          const foundPayPeriod = await PayPeriod.findById(id);
          if (foundPayPeriod) {
            Object.assign(foundPayPeriod, body);
            const updatedPayperiod = await foundPayPeriod.save();
            res.status(200).json(updatedPayperiod);
          } else {
            res.status(400).json({
              message:
                messages.modelNotFound<PayPeriodDoc>(foundPayPeriod),
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
        const foundPayPeriod = await PayPeriod.findById(id);
        await Promise.all([
          PayPeriod.deleteOne({ _id: foundPayPeriod._id }),
          User.updateOne(
            { payPeriods: foundPayPeriod._id },
            { $pull: { payPeriods: foundPayPeriod._id } }
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

export default createPayPeriodRoute;
