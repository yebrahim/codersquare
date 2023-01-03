import { ENDPOINT_CONFIGS } from '@codersquare/shared';
import { RequestHandler } from 'express';

import { LOGGER } from '../logging';

export const loggerMiddleware: RequestHandler = (req, _, next) => {
  const config = Object.values(ENDPOINT_CONFIGS).find(o => o.url === req.url);
  const body = config && config.sensitive ? '[REDACTED]' : { ...req.body };
  LOGGER.log({
    level: 'info',
    message: `Request: ${req.method} ${req.path} - body: ${JSON.stringify(body)}`,
    method: req.method,
    path: req.path,
    body,
  });
  next();
};
