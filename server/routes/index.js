import 'babel-polyfill';
import express from 'express';
import users from './users';
import meals from './meals';
import menus from './menus';
import orders from './orders';

/**
 * Route handler for api v1
 * Passes the router object to individual routers for processing
 */

const router = express.Router();

router.get('/', (request, response) => {
  response.status(200).send({ message: 'Welcome to Book A Meal API version 1.' });
});

// create the error object in the request object
router.all('*', (request, response, next) => {
  request.errors = {};
  next();
});

// routes requests related to users authentication
users(router);

// routes requests related to meals
meals(router);

// routes request related to menus
menus(router);

// routes request related to orders
orders(router);

export default router;
