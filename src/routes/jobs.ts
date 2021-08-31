import express, { Router } from 'express';
import mongoose from 'mongoose';
import MessageHelper from '../utils/messageHelper';
import { JobModel, createJobModel, JobDoc } from '../models/jobModel';
import { UserModel, createUserModel } from '../models/userModel';
import {
  RepairOrderModel,
  createRepairOrderModel,
} from '../models/repairOrderModel';
import DbFunctions from '../utils/dbFunctions';

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

  // #region New Job Routes
  router.post('/:id', async (req, res, next) => {
    try {
      if (req.session.userId) {
        const { userId } = req.session;
        const { id } = req.params;
        const ro = await RepairOrder.findById(id);
        const newJob = new Job({
          userId,
          name: 'Test',
          description: 'remove at a later time.',
          time: 100,
        });
        const savedJob = await newJob.save();
        ro.jobs.push(savedJob._id);
        await ro.save();
        res.status(201).json(savedJob);
      } else {
        res.status(400).json({ message: messages.badSession });
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * EXPERIMENTAL::Saves many jobs at one time.
   * Body:
   *   [
   *     {JobModel: Object},
   *   ]
   */
  router.post('/many/:id', async (req, res, next) => {
    try {
      if (req.session.userId) {
        const { userId } = req.session;
        const { id } = req.params;
        const { jobs } = req.body;
        if (jobs) {
          if (jobs.length <= 50 && jobs.length > 0) {
            const parentRO = await RepairOrder.findById(id);
            if (parentRO) {
              const savedJobs = await DbFunctions.createManyJobs(
                jobs,
                Job,
                parentRO
              );
              res.status(201).json(savedJobs);
            } else {
              res
                .status(400)
                .json({ message: messages.modelNotFound('Repair Order') });
            }
          } else {
            res.status(400).json({ message: messages.tooManyModels });
          }
        } else {
          res.status(400).json({ message: messages.noBody });
        }
      } else {
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

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
