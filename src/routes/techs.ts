import express, { Router } from 'express';
import mongoose from 'mongoose';
import { UserModel, createUserModel } from '../models/userModel';
import { TechModel, createTechModel } from '../models/techModel';
import MessageHelper from '../utils/messageHelper';

const router = express.Router();
const messages = MessageHelper.get();

const createTechRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
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
        const foundTech = await Tech.findById(id);
        await Promise.all([
          Tech.deleteOne({ _id: foundTech._id }),
          User.updateOne(
            { payPeriods: foundTech._id },
            { $pull: { payPeriods: foundTech._id } }
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

export default createTechRoute;
