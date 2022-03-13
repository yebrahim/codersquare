import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';

import { initDb } from './datastore';
import { signInHandler, signUpHandler } from './handlers/authHandler';
import { createCommentHandler, deleteCommentHandler } from './handlers/commentHandler';
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

  //Public endpoints
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

  app.use(authMiddleware);

  //Private endpoints
  app.get('/v1/posts', asyncHandler(listPostsHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));
  app.delete('/v1/posts/:id', asyncHandler(deletePostHandler));
  app.get('/v1/posts/:id', asyncHandler(getPostHandler));

  app.post('/v1/likes/new', asyncHandler(createLikeHandler));
  app.get('/v1/likes/:postId', asyncHandler(getLikesHandler));

  app.post('/v1/comments/new', asyncHandler(createCommentHandler));
  //TODO: implement getCommentsHandler
  //app.get('/v1/comments/list',asyncHandler(getCommentsHandler) )
  app.delete('/v1/comments/:id', asyncHandler(deleteCommentHandler));

  app.use(errHandler);

  app.listen(3000);
})();
