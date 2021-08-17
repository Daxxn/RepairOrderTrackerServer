import express, { Router } from 'express';
import mongoose from 'mongoose';
import {
  TechModel,
  TechDoc,
  createTechModel,
  TechObjects
} from '../models/techModel';

const router = express.Router();

const createTechRoute = (db: typeof mongoose): Router => {
  const message = 'I will setup AUTH later. I promise<Hopefully>.';
  const Tech: TechModel = createTechModel(db);

  router.get('/', async (req, res, next) => {
    try {
      res.status(420).json({ message });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      res.status(420).json({ message });
    } catch (err) {
      next(err);
    }
  });

  router.patch('/', async (req, res, next) => {
    try {
      res.status(420).json({ message });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/', async (req, res, next) => {
    try {
      res.status(420).json({ message });
    } catch (err) {
      next(err);
    }
  });

  return router;
};

export default createTechRoute;
