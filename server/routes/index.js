import express from 'express';
import users from './users';

/**
 * Route handler for api v1
 * Passes the router object to individual routers for processing
 */

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to Book A Meal API version 1.' });
});

users(router);

export default router;