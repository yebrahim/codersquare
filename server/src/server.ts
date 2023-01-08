import { ENDPOINT_CONFIGS, Endpoints, TrackRequest } from '@codersquare/shared';
import cors from 'cors';
import express, { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import mixpanel from 'mixpanel';

import { db, initDb } from './datastore';
import { CommentHandler } from './handlers/commentHandler';
import { LikeHandler } from './handlers/likeHandler';
import { PostHandler } from './handlers/postHandler';
import { UserHandler } from './handlers/userHandler';
import { LOGGER } from './logging';
import { enforceJwtMiddleware, jwtParseMiddleware } from './middleware/authMiddleware';
import { errHandler } from './middleware/errorMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { ExpressHandler } from './types';

export async function createServer(logRequests = true) {
  const dbPath = process.env.DB_PATH;
  if (!dbPath) {
    LOGGER.error('DB_PATH env var missing');
    process.exit(1);
  }
  await initDb(dbPath);

  const mixpanelToken = process.env.MIXPANEL_TOKEN;
  if (!mixpanelToken) {
    LOGGER.error('MIXPANEL_TOKEN en var is missing');
    process.exit(1);
  }
  const mixpanelTracker = mixpanel.init(mixpanelToken);

  const trackHandler: ExpressHandler<TrackRequest, any> = (req, res) => {
    if (!req.body.eventName) {
      return res.status(400).send({ error: 'Missing event name' });
    }
    mixpanelTracker.track(req.body.eventName, req.body.payload ?? {}, undefined);
    res.send({ status: 'ok' });
  };

  // create express app
  const app = express();

  // middlewares for parsing JSON payloads and opening up cors policy
  app.use(express.json());
  app.use(cors());

  if (logRequests) {
    // log incoming Requests
    app.use(loggerMiddleware);
  }

  const userHandler = new UserHandler(db);
  const postHandler = new PostHandler(db);
  const likeHandler = new LikeHandler(db);
  const commentHandler = new CommentHandler(db);

  // map of endpoints handlers
  const HANDLERS: { [key in Endpoints]: RequestHandler<any, any> } = {
    [Endpoints.healthz]: (_, res) => res.send({ status: 'ok!' }),
    [Endpoints.track]: trackHandler,

    [Endpoints.signin]: userHandler.signIn,
    [Endpoints.signup]: userHandler.signUp,
    [Endpoints.getUser]: userHandler.get,
    [Endpoints.getCurrentUser]: userHandler.getCurrent,
    [Endpoints.updateCurrentUser]: userHandler.updateCurrentUser,

    [Endpoints.listPosts]: postHandler.list,
    [Endpoints.getPost]: postHandler.get,
    [Endpoints.createPost]: postHandler.create,
    [Endpoints.deletePost]: postHandler.delete,

    [Endpoints.listLikes]: likeHandler.list,
    [Endpoints.createLike]: likeHandler.create,
    [Endpoints.deleteLike]: likeHandler.delete,

    [Endpoints.countComments]: commentHandler.count,
    [Endpoints.listComments]: commentHandler.list,
    [Endpoints.createComment]: commentHandler.create,
    [Endpoints.deleteComment]: commentHandler.delete,
  };

  // register handlers in express
  Object.keys(Endpoints).forEach(entry => {
    const config = ENDPOINT_CONFIGS[entry as Endpoints];
    const handler = HANDLERS[entry as Endpoints];

    config.auth
      ? app[config.method](
          config.url,
          jwtParseMiddleware,
          enforceJwtMiddleware,
          asyncHandler(handler)
        )
      : app[config.method](config.url, jwtParseMiddleware, asyncHandler(handler));
  });

  app.use(errHandler);

  // start server, https in production, otherwise http.
  const { ENV } = process.env;

  if (!ENV) {
    throw 'Environment not defined, make sure to pass in env vars or have a .env file at root.';
  }

  return app;
}
