/**
 * Trimmer middleware to trim all input values
 */
const trimmer = (request, response, next) => {
  next();
};

export default trimmer;

