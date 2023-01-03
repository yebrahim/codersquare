import { ENDPOINT_CONFIGS } from '@codersquare/shared';
import { RequestHandler } from 'express';

export const loggerMiddleware: RequestHandler = (req, _, next) => {
  const config = Object.values(ENDPOINT_CONFIGS).find(o => o.url === req.url);
  const body = config && config.sensitive ? '<redacted>' : { ...req.body };
  console.log(req.method, req.path, '- body:', body);
  next();
};
