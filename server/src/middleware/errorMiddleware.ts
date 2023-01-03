import { ErrorRequestHandler } from 'express';

import { LOGGER } from '../logging';

export const errHandler: ErrorRequestHandler = (err, _, res, __) => {
  LOGGER.error('Uncaught exception:', err);
  return res.status(500).send('Oops, an unexpected error occurred, please try again');
};
