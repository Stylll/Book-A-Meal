import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import open from 'open';

import routes from './routes';
import trimmer from './utils/trimmer';

/* eslint-disable no-console no-unused-vars */
/* eslint-disable no-unused-vars */

const port = process.env.PORT || 3000;
const app = express();
const address = `http://localhost:${port}/api/v1`;

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(trimmer);

// Pass api/v1 requests to routes
app.use('/api/v1', routes);

// Handle 404 errors and forward to error handler
app.use((req, res, next) => {
  const err = new Error('404 not found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message || 'Error' });
});

// UnhandledPromiseRejection Handler
process.on('unhandledRejection', (error) => {
  console.log('unhandledRejection here: ', error);
});

// Listen at designated port
app.listen(port, (err) => {
  if (err) {
    // log to file
  } else {
    open(address);
  }
});

export default app;
