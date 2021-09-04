import express, { Router } from 'express';
import mongoose from 'mongoose';
import { UserModel, createUserModel } from '../models/userModel';
import { TechModel, createTechModel } from '../models/techModel';
import MessageHelper from '../utils/messageHelper';
import { createJobModel, JobModel } from '../models/jobModel';

const router = express.Router();
const messages = MessageHelper.get();

const createTechRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
  const Tech: TechModel = createTechModel(db);
  const Job: JobModel = createJobModel(db);

  router.get('/', async (req, res, next) => {
    try {
      res.status(420).json({ message: messages.notImplemented });
    } catch (err) {
      next(err);
    }
  });

  // #region New Tech Routes
  router.post('/', async (req, res, next) => {
    try {
      const { body } = req;
      if (body) {
        const newTech = new Tech(body);
        await newTech.save();
        res.status(201).json(newTech);
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  // #region Update Tech Routes
  router.patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { body } = req;
      if (id) {
        const foundTech = await Tech.findById(id);
        if (body) {
          if (foundTech) {
            Object.assign(foundTech, body);
            const savedTech = await foundTech.save();
            res.status(201).json(savedTech);
          } else {
            res
              .status(400)
              .json({ message: messages.modelNotFound(foundTech) });
          }
        } else {
          res.status(400).json({ message: messages.noBody });
        }
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  // #region Delete Tech Routes
  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id) {
        const foundTech = await Tech.findById(id);
        await Promise.all([
          Tech.deleteOne({ _id: foundTech._id }),
          Job.updateMany(
            { assignedTech: foundTech._id },
            { $pull: { assignedTech: foundTech._id } }
          ),
        ]);
      } else {
        res.status(400).json({ message: messages.noId });
      }
    } catch (err) {
      next(err);
    }
  });
  // #endregion

  return router;
};

export default createTechRoute;
