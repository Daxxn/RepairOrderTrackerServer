import bodyParser from 'body-parser';
import express, { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import {
  UserModel,
  UserDoc,
  UserData,
  createUserModel
} from '../models/userModel';

const router = express.Router();

const createUserRoute = (db: typeof mongoose): Router => {
  const User: UserModel = createUserModel(db);
  const message = 'I will setup AUTH later. I promise<Hopefully>.';
  router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userName } = req.body;
        if (userName) {
          const foundUser = await User.find({
            userName
          });
          if (!foundUser) {
            const newUser = new User({
              userName
            });
            await newUser.save();
            res.status(201).json(newUser);
          } else {
            res.status(400).json({
              message: 'UserName already exists.'
            });
          }
        } else {
          res.status(400).json({
            message: 'Could not create user. userName must be provided.'
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  router.patch(
    '/$id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { body } = req;
        if (body) {
          const foundUser = await User.findById(req.params.id);
          if (foundUser) {
            if (body._id) {
              delete body._id;
            }
            if (body.userName) {
              delete body.userName;
            }
            Object.assign(foundUser, req.body);
            await foundUser.save();
            res.status(201).json(foundUser);
          } else {
            res.status(400).json({
              message: 'No user found.'
            });
          }
        } else {
          res.status(400).json({
            message: 'No user properties provided.'
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/$id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        if (id) {
          const foundUser = await User.findById(id);
          if (foundUser) {
            await foundUser.remove();
            res.status(201).json({
              message: 'User deleted.'
            });
          } else {
            res.status(400).json({
              message: 'No user found.'
            });
          }
        } else {
          res.status(400).json({
            message: 'No id provided.'
          });
        }
      } catch (err) {
        next(err);
      }
    }
  );
  return router;
};

export default createUserRoute;
