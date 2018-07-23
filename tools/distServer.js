import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import open from 'open';
import path from 'path';
import compression from 'compression';
import routes from '../server/routes';
import trimmer from '../server/utils/trimmer';

/* eslint-disable no-console no-unused-vars */
/* eslint-disable no-unused-vars */

const port = process.env.PORT || 3000;
const app = express();
const address = `http://localhost:${port}`;

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(trimmer);

// static api docs
app.use('/api-docs', express.static(path.join(__dirname, '../server/api-docs')));

// assets
app.use('/assets', express.static(path.join(__dirname, '../client/src/assets')));

// Pass api/v1 requests to routes
app.use('/api/v1', routes);

// handle react requests
app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Handle 404 errors and forward to error handler
app.use((req, res, next) => {
  const err = new Error('404 not found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || 'Error' }));

// UnhandledPromiseRejection Handler
process.on('unhandledRejection', (error) => {
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
