import { RequestHandler } from 'express';

export const loggerMiddleware: RequestHandler = (req, _, next) => {
  console.log(req.method, req.path, '- body:', req.body);
  next();
};
