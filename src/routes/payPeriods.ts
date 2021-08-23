import express, { Router } from 'express';
import mongoose from 'mongoose';
import {
  PayPeriodModel,
  PayPeriodDoc,
  PayPeriodObjects,
  createPayPeriodModel
} from '../models/payperiodModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createPayPeriodRoute = (db: typeof mongoose): Router => {
  const message = 'I will set it up later. I promise<Hopefully>.';
  const PayPeriod: PayPeriodModel = createPayPeriodModel(db);

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

export default createPayPeriodRoute;
