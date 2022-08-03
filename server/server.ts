import cors from 'cors';
import dotenv from 'dotenv';
import express, { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { db, initDb } from './datastore';
import { ENDPOINT_CONFIGS, Endpoints } from './endpoints';
import { AuthHandler } from './handlers/authHandler';
import { CommentHandler } from './handlers/commentHandler';
import { LikeHandler } from './handlers/likeHandler';
import { PostHandler } from './handlers/postHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errHandler } from './middleware/errorMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';

export async function createServer(dbPath: string, logRequests = true) {
  await initDb(dbPath);
  // read .env file
  dotenv.config();

  // create express app
  const app = express();

  // middlewares for parsing JSON payloads and opening up cors policy
  app.use(express.json());
  app.use(cors());

  if (logRequests) {
    //Log incoming Requests
    app.use(loggerMiddleware);
  }

  const authHandler = new AuthHandler(db);
  const postHandler = new PostHandler(db);
  const likeHandler = new LikeHandler(db);
  const commentHandler = new CommentHandler(db);

  // Map of endpoints handlers
  const HANDLERS: { [key in Endpoints]: RequestHandler<any, any> } = {
    [Endpoints.healthz]: (_, res) => res.send({ status: 'ok!' }),

    [Endpoints.signin]: authHandler.signInHandler,
    [Endpoints.signup]: authHandler.signUpHandler,

    [Endpoints.listPosts]: postHandler.listPostsHandler,
    [Endpoints.getPost]: postHandler.getPostHandler,
    [Endpoints.createPost]: postHandler.createPostHandler,
    [Endpoints.deletePost]: postHandler.deletePostHandler,

    [Endpoints.listLikes]: likeHandler.listLikesHandler,
    [Endpoints.createLike]: likeHandler.createLikeHandler,

    [Endpoints.listComments]: commentHandler.listCommentsHandler,
    [Endpoints.createComment]: commentHandler.createCommentHandler,
    [Endpoints.deleteComment]: commentHandler.deleteCommentHandler,
  };

  // Register handlers in express
  Object.keys(Endpoints).forEach(entry => {
    const config = ENDPOINT_CONFIGS[entry as Endpoints];
    const handler = HANDLERS[entry as Endpoints];

    config.auth
      ? app[config.method](config.url, authMiddleware, asyncHandler(handler))
      : app[config.method](config.url, asyncHandler(handler));
  });

  app.use(errHandler);

  // Start server, https in production, otherwise http.
  const { ENV } = process.env;

  if (ENV === 'production') {
    const key = fs.readFileSync('/home/codersquare-user/certs/privkey1.pem', 'utf-8');
    const cert = fs.readFileSync('/home/codersquare-user/certs/cert1.pem', 'utf-8');

    return https.createServer({ key, cert }, app);
  } else {
    return http.createServer(app);
  }
}
