import { verifyJwt } from '../auth';
import { db } from '../datastore';
import { ExpressHandler, JwtObject } from '../types';

export const jwtParseMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next();
  }

  let payload: JwtObject;
  try {
    payload = verifyJwt(token);
  } catch {
    return res.status(401).send({ error: 'Bad token' });
  }

  const user = await db.getUserById(payload.userId);
  if (!user) {
    return res.status(401).send({ error: 'User not found' });
  }
  res.locals.userId = user.id;
  return next();
};

export const enforceJwtMiddleware: ExpressHandler<any, any> = async (_, res, next) => {
  if (!res.locals.userId) {
    return res.sendStatus(401);
  }
  return next();
};
