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
  const User: UserModel = createUserModel(db);

  router.get('/', (req, res) => {
    if (process.env.USE_AUTH == 'true') {
      res.status(420).json({ message: messages.notImplemented });
    } else {
      res.status(420).json({ message: messages.needToSetupAuth });
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      if (req.session && req.session.userId) {
        console.log('User already logged in.');
        res.redirect(`api/users/${req.session.userId}`);
      }
      if (req.session && req.session.accessToken) {
        console.log('User has access token but needs to login.');
        const foundUser = await User.findOne({ auth0Id: req.session.userId })
      } else {
        res.status(420).json({ message: messages.needToSetupAuth });
      }
    } catch (err) {
      next(err);
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
