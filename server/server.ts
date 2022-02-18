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
import { requestLoggerMiddleware } from './middleware/loggerMiddleware';

(async () => {
  await initDb();
  dotenv.config();

  const app = express();

  app.use(express.json());

  app.use(requestLoggerMiddleware);

  // Public endpoints
  app.get('/healthz', (req, res) => res.send({ status: '✌️' }));
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));
  // TODO: create signOutHandler

  app.use(authMiddleware);

  // Protected endpoints
  app.get('/v1/posts', asyncHandler(listPostsHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));
  app.delete('/v1/posts', asyncHandler(deletePostHandler));
  app.get('/v1/posts/:id', asyncHandler(getPostHandler));

  app.post('/v1/likes', asyncHandler(createLikeHandler));
  app.get('/v1/likes/:postId', asyncHandler(getLikesHandler));

  app.post('/v1/comments', asyncHandler(createCommentHandler));
  app.delete('/v1/comments/:id', asyncHandler(deleteCommentHandler));
  // TODO: create listCommentsHandler

  app.use(errHandler);

  app.listen(process.env.PORT || 3000);
})();
