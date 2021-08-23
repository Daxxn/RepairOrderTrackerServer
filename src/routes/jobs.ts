import express, { Router } from 'express';
import mongoose from 'mongoose';
import MessageHelper from '../utils/messageHelper';
import {
  JobModel,
  JobDoc,
  JobObjects,
  createJobModel,
} from '../models/jobModel';
import { UserModel, createUserModel } from '../models/userModel';

const router = express.Router();
const messages = MessageHelper.get();

const createJobRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
  const Job: JobModel = createJobModel(db);

  router.get('/', async (req, res, next) => {
    try {
      // @ts-ignore: Property 'userId' does not exist on type 'Session & Partial<SessionData>
      const { userId } = req.session;
      if (userId) {
        const foundJobs = await Job.find({ userId: userId });
        res.status(200).json(foundJobs);
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('byuser/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundUser = await User.findById(id);
        if (foundUser) {
          const foundJobs = await Job.find({ userId: foundUser._id });
        } else {
          
        }
      } else {
        
      }
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundJob = await Job.findById(id);
        if (foundJob) {
          res.status(200).json(foundJob);
        } else {
          res
            .status(400)
            .json({ message: messages.modelNotFound(foundJob) });
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

export default createJobRoute;
