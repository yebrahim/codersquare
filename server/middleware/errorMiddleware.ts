import { ErrorRequestHandler } from 'express';

export const errHandler: ErrorRequestHandler = (err, _, res, __) => {
  console.error('Uncaught exception:', err);
  return res.status(500).send('Oops, an unexpected error occurred, please try again');
};
