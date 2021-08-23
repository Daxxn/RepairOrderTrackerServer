import express, { Router } from 'express';
import mongoose from 'mongoose';
import {
  RepairOrderModel,
  RepairOrderDoc,
  RepairOrderObjects,
  createRepairOrderModel
} from '../models/repairorderModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createRepairOrderRoute = (db: typeof mongoose): Router => {
  const message = 'I will setup AUTH later. I promise<Hopefully>.';
  const RepairOrder: RepairOrderModel = createRepairOrderModel(db);

  router.get('/', async (req, res, next) => {
    try {
      res.status(420).json({ message: messages.notImplemented });
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
