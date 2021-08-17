import express, { Router } from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import createJobRoute from './jobs';
import createPayPeriodRoute from './payPeriods';
import createRepairOrderRoute from './repairOrders';
import createTechRoute from './techs';
import createUserRoute from './users';

/**
 * Creates the express Router for the `/api` endpoint.
 *
 * @param {mongoose} db the connected MongoDB database
 * @returns {Router} the Router for the `/api` endpoint
 */
function createApiRouter(db: typeof mongoose): Router {
  router.use('/users', createUserRoute(db));
  router.use('/jobs', createJobRoute(db));
  router.use('/pay-periods', createPayPeriodRoute(db));
  router.use('/repair-orders', createRepairOrderRoute(db));
  router.use('/techs', createTechRoute(db));

  // /**
  //  * Setup the swagger front end for the API. This needs to be specified last
  //  * so that it doesn't get in the way of the other paths.
  //  */
  // router.use('/', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  return router;
}

export default createApiRouter;
