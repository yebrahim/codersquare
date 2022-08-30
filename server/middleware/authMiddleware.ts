import { verifyJwt } from '../auth';
import { db } from '../datastore';
import { ExpressHandler } from '../types';

export const jwtParseMiddleware: ExpressHandler<any, any> = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const payload = verifyJwt(token);
    const user = await db.getUserById(payload.userId);
    if (!user) {
      return res.status(401).send({ error: 'User not found' });
    }
    res.locals.userId = user.id;
    return next();
  } catch {
    return res.status(401).send({ error: 'Bad token' });
  }
};

export const enforceJwtMiddleware: ExpressHandler<any, any> = async (_, res, next) => {
  if (!res.locals.userId) {
    return res.sendStatus(401);
  }
  return next();
};
