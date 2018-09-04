import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import open from 'open';
import path from 'path';
import routes from './routes';
import CustomLogger from '../config/logger';

/* eslint-disable no-console no-unused-vars */
/* eslint-disable no-unused-vars */

const port = process.env.PORT || 3000;
const app = express();
const address = `http://localhost:${port}/api/v1`;

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static api docs
app.use('/api-docs', express.static(path.join(__dirname, './api-docs')));

// Pass api/v1 requests to routes
app.use('/api/v1', routes);

// Handle 404 errors and forward to error handler
app.use((request, response, next) => {
  const error = new Error('404 not found');
  error.status = 404;
  next(error);
});

// Error Handler
app.use((error, request, response, next) => response.status(error.status || 500)
  .json({ message: error.message || 'Error' }));

// UnhandledPromiseRejection Handler
process.on('unhandledRejection', (error) => {
  CustomLogger.error(error);
});

// Listen at designated port
app.listen(port, (error) => {
  if (error) {
    CustomLogger.error(error);
  } else {
    open(address);
  }
});

export default app;
