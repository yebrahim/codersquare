import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import https from 'https';

import { initDb } from './datastore';
import { ENDPOINT_CONFIGS, Endpoints } from './endpoints';
import { signInHandler, signUpHandler } from './handlers/authHandler';
import {
  createCommentHandler,
  deleteCommentHandler,
  getCommentsHandler,
} from './handlers/commentHandler';
import { createLikeHandler, getLikesHandler } from './handlers/likeHandler';
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  listPostsHandler,
} from './handlers/postHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errHandler } from './middleware/errorMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { ExpressHandler } from './types';

(async () => {
  await initDb();
  //Read .env file
  dotenv.config();

  //run express lib
  const app = express();

  //It parses incoming requests with JSON payloads and is based on body-parser.
  app.use(express.json());

  //Log incoming Requests
  app.use(loggerMiddleware);

  // Map of enpoints handlers
  const HANDLERS: { [key in Endpoints]: ExpressHandler<any, any> } = {
    [Endpoints.signin]: signInHandler,
    [Endpoints.signup]: signUpHandler,

    [Endpoints.listPosts]: listPostsHandler,
    [Endpoints.getPost]: getPostHandler,
    [Endpoints.createPost]: createPostHandler,
    [Endpoints.deletePost]: deletePostHandler,

    [Endpoints.getLikes]: getLikesHandler,
    [Endpoints.createLike]: createLikeHandler,

    [Endpoints.getComments]: getCommentsHandler,
    [Endpoints.createComment]: createCommentHandler,
    [Endpoints.deleteComment]: deleteCommentHandler,
  };

  // Register handlers in express
  Object.keys(Endpoints).forEach(entry => {
    const config = ENDPOINT_CONFIGS[entry as Endpoints];
    const handler = HANDLERS[entry as Endpoints];
    const url = '/api/v1' + config.url;

    config.auth
      ? app[config.method](url, authMiddleware, asyncHandler(handler))
      : app[config.method](url, asyncHandler(handler));
  });

  app.get('/healthz', (_, res) => res.send({ status: 'ok!' }));

  app.use(errHandler);

  // Start server, https in production, otherwise http.
  const { ENV, PORT } = process.env;
  const listener = () => console.log(`Listening on port ${PORT} in ${ENV} environment`);

  if (ENV === 'production') {
    const key = fs.readFileSync('/home/codersquare-user/certs/privkey1.pem', 'utf-8');
    const cert = fs.readFileSync('/home/codersquare-user/certs/cert1.pem', 'utf-8');

    https.createServer({ key, cert }, app).listen(PORT, listener);
  } else {
    app.listen(PORT, listener);
  }
})();
