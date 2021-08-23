import express, { Router } from 'express';
import mongoose from 'mongoose';
import { createUserModel, UserModel } from '../models/userModel';
import {
  RepairOrderModel,
  createRepairOrderModel
} from '../models/repairorderModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createRepairOrderRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
  const RepairOrder: RepairOrderModel = createRepairOrderModel(db);

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
          res.status(400).json({ message: messages.modelNotFound(foundRO)});
        }
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      res.status(420).json({ message: messages.notImplemented });
    } catch (err) {
      next(err);
    }
  });

  router.patch('/', async (req, res, next) => {
    try {
      res.status(420).json({ message: messages.notImplemented });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/', async (req, res, next) => {
    try {
      res.status(420).json({ message: messages.notImplemented });
    } catch (err) {
      next(err);
    }
  });

  return router;
};

export default createRepairOrderRoute;
