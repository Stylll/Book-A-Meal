/**
 * Async wrapper for promises.
 * Wraps async functions with a catch block.
 * Handles exceptions fired from async functions.
 * @param {function} function
 * @returns {function} wrapped function
 * Original code written by codebarbarian.
 * Gotten from http://thecodebarbarian.com/80-20-guide-to-express-error-handling.html
 */

const wrapAsync = fn => (request, response, next) => {
  fn(request, response, next).catch(next);
};

export default wrapAsync;
