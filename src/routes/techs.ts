import express, { Router } from 'express';
import mongoose from 'mongoose';
import {
  TechModel,
  TechDoc,
  createTechModel,
  TechObjects
} from '../models/techModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createTechRoute = (db: typeof mongoose): Router => {
  const Tech: TechModel = createTechModel(db);

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

export default createTechRoute;
