import express, { Router } from 'express';
import mongoose from 'mongoose';
import MessageHelper from '../utils/messageHelper';
import { UserModel, createUserModel } from '../models/userModel';

const router = express.Router();
const messages = MessageHelper.get();

/**
 * I may not need to do this. The Auth0 server will
 * take care of it??
 * @param db
 * @returns {Router} Router
 */
const createAuthRoute = (db: typeof mongoose): Router => {
  const Users: UserModel = createUserModel(db);

  router.get('/', (req, res) => {
    if (process.env.USE_AUTH == 'true') {
      res.status(420).json({ message: messages.notImplemented });
    } else {
      res.status(420).json({ message: messages.needToSetupAuth });
    }
  });

  router.post('/login', (req, res) => {
    // Need to send token to Auth0 for checking.
    // Then need to store the user ID in the session
    // And create a cookie for the session?? (Check what PointSpire does.)
    if (process.env.USE_AUTH == 'true') {
      res.status(420).json({ message: messages.notImplemented });
    } else {
      res.status(420).json({ message: messages.needToSetupAuth });
    }
  });

  router.patch('/', (req, res) => {
    if (process.env.USE_AUTH == 'true') {
      res.status(420).json({ message: messages.notImplemented });
    } else {
      res.status(420).json({ message: messages.needToSetupAuth });
    }
  });

  router.delete('/', (req, res) => {
    if (process.env.USE_AUTH == 'true') {
      res.status(420).json({ message: messages.notImplemented });
    } else {
      res.status(420).json({ message: messages.needToSetupAuth });
    }
  });

  return router;
};

export default createAuthRoute;
