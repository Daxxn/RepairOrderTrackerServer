import express, { Router } from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const createAuthRoute = (db: typeof mongoose): Router => {
  const _ = db;
  const message = 'I will setup AUTH later. I promise<Hopefully>.';

  router.get('/', (req, res) => {
    res.status(420).json({ message });
  });

  router.post('/login', (req, res) => {
    // Need to send token to Auth0 for checking.
    // Then need to store the user ID in the session
    // And create a cookie for the session?? (Check what PointSpire does.)
  });

  router.patch('/', (req, res) => {
    res.status(420).json({ message });
  });

  router.delete('/', (req, res) => {
    res.status(420).json({ message });
  });

  return router;
};

export default createAuthRoute;
