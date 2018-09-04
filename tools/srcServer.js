import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import open from 'open';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import routes from '../server/routes';
import { cancelPendingOrders } from '../server/utils/jobScheduler';
import CustomLogger from '../config/logger';

/* eslint-disable no-console no-unused-vars */
/* eslint-disable no-unused-vars */

const port = process.env.PORT || 3000;
const app = express();
const address = `http://localhost:${port}`;

const compiler = webpack(config);

// Middleware
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static api docs
app.use('/api-docs', express.static(path.join(__dirname, '../server/api-docs')));

// assets
app.use('/assets', express.static(path.join(__dirname, '../client/src/assets')));

// Pass api/v1 requests to routes
app.use('/api/v1', routes);

// handle react requests
app.get('/*', (request, response) => {
  response.sendFile(path.join(__dirname, '../client/src/index.html'));
});

// Handle 404 errors and forward to error handler
app.use((request, response, next) => {
  const error = new Error('404 not found');
  error.status = 404;
  next(error);
});

// Error Handler
app.use((error, request, response, next) =>
  response.status(error.status || 500).json({ message: error.message || 'Error' }));

// UnhandledPromiseRejection Handler
process.on('unhandledRejection', (error) => {
  CustomLogger.error(error);
});

// Listen at designated port
app.listen(port, (error) => {
  if (error) {
    CustomLogger.error(error);
  } else {
    cancelPendingOrders();
    open(address);
  }
});

export default app;
