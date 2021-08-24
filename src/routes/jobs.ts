import express, { Router } from 'express';
import mongoose from 'mongoose';
import MessageHelper from '../utils/messageHelper';
import { JobModel, createJobModel } from '../models/jobModel';
import { UserModel, createUserModel } from '../models/userModel';
import {
  RepairOrderModel,
  createRepairOrderModel,
} from '../models/repairorderModel';

const router = express.Router();
const messages = MessageHelper.get();

const createJobRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
  const Job: JobModel = createJobModel(db);
  const RepairOrder: RepairOrderModel = createRepairOrderModel(db);

  // router.get('/', async (req, res, next) => {
  //   try {
  //     // @ts-ignore: Property 'userId' does not exist on type 'Session & Partial<SessionData>'.ts(2339)
  //     const { userId } = req.session;
  //     if (userId) {
  //       const foundJobs = await Job.find({ userId: userId });
  //       res.status(200).json(foundJobs);
  //     } else {
  //       res.status(400).json({ message: messages.noId });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  /**
   * Needs to be converted later to use the req.session object
   * for the user ID.
   */
  router.get('byuser/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundUser = await User.findById(id);
        if (foundUser) {
          const foundJobs = await Job.find({ userId: foundUser._id });
          res.status(200).json(foundJobs);
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
      const { body } = req;
      if (body) {
        if (body._id) {
          delete body._id;
        }
        const newTech = new Job(body);
        const savedTech = await newTech.save();
        res.status(201).json(savedTech);
      } else {
        res.status(400).json({ message: messages.noBody });
      }
    } catch (err) {
      next(err);
    }
  });

  router.patch('/:id', async (req, res, next) => {
    try {
      res.status(420).json({ message: messages.notImplemented });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundJob = await Job.findById(id);
        await Promise.all([
          Job.deleteOne({ _id: foundJob._id }),
          RepairOrder.updateMany(
            { jobs: foundJob._id },
            { $pull: { jobs: foundJob._id } }
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

export default createJobRoute;
