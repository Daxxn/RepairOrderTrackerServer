import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const createUserRoute = (db: typeof mongoose) => {
  const message = 'I will setup AUTH later. I promise<Hopefully>.';
  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message });
  });

  router.post('/', (req, res, next) => {
    res.status(420).json({ message });
  });

  router.patch('/', (req, res, next) => {
    res.status(420).json({ message });
  });

  router.delete('/', (req, res, next) => {
    res.status(420).json({ message });
  });
  return router;
};

export default createUserRoute;
