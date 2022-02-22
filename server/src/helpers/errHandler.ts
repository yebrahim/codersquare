import { ErrorRequestHandler } from 'express';

const errHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Uncaught exception:', err);
  return res.status(500).send('Oops, an unexpected error occurred, please try again');
};

export { errHandler };
