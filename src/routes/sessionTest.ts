import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const router = Router();

const createSessionTestRoute = (db: typeof mongoose): Router => {
  router.get('/id', (req, res, next) => {
    try {
      const { session } = req;
      if (session && session.id) {
        res.status(200).json({
          message: 'test finished.',
        });
      } else {
        res.status(400).json({
          message: 'No session is initialized.',
        });
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};

export default createSessionTestRoute;